#!/usr/bin/env node
/* global console, process */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(scriptPath), '..');
const projectOsRoot = path.join(repoRoot, 'docs/project-os');

const paths = {
  taskBoard: path.join(projectOsRoot, 'TASK_BOARD.md'),
  roadmap: path.join(projectOsRoot, 'ROADMAP.md'),
  summary: path.join(projectOsRoot, 'dashboard/summary.md'),
  dashboard: path.join(projectOsRoot, 'dashboard/dashboard.json'),
  rootDashboard: path.join(projectOsRoot, 'dashboard.json'),
  tasksDir: path.join(projectOsRoot, 'tasks'),
};

const issues = [];
const checks = [];

const taskIdPattern = /^T-\d{3}$/;
const taskMarkdownPattern = /^(T-\d{3})(?:[-_].*)?\.md$/;

function relativePath(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

async function readText(label, filePath) {
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    issues.push(`${label}: 无法读取 ${relativePath(filePath)} (${error.message})`);
    return null;
  }
}

function parseJson(label, filePath, text) {
  if (text === null) {
    return null;
  }

  try {
    const data = JSON.parse(text);
    checks.push(`${relativePath(filePath)} JSON 合法`);
    return data;
  } catch (error) {
    issues.push(`${label}: JSON 不合法 (${error.message})`);
    return null;
  }
}

function extractTaskIdFromFilename(fileName) {
  return fileName.match(taskMarkdownPattern)?.[1] ?? null;
}

async function readTaskMarkdownFiles() {
  let entries;

  try {
    entries = await readdir(paths.tasksDir, { withFileTypes: true });
  } catch (error) {
    issues.push(`tasks/T-*.md: 无法读取目录 ${relativePath(paths.tasksDir)} (${error.message})`);
    return { byId: new Map(), relPaths: new Set(), count: 0 };
  }

  const taskFiles = entries
    .filter((entry) => entry.isFile() && taskMarkdownPattern.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  const byId = new Map();
  const relPaths = new Set();
  let count = 0;

  await Promise.all(
    taskFiles.map(async (entry) => {
      const filePath = path.join(paths.tasksDir, entry.name);
      const rel = relativePath(filePath);
      const id = extractTaskIdFromFilename(entry.name);

      try {
        await readFile(filePath, 'utf8');
        count += 1;
        relPaths.add(rel);

        const existing = byId.get(id) ?? [];
        existing.push(rel);
        byId.set(id, existing);
      } catch (error) {
        issues.push(`tasks/T-*.md: 无法读取 ${rel} (${error.message})`);
      }
    }),
  );

  checks.push(`docs/project-os/tasks/T-*.md 已读取 ${count} 个任务文档`);
  return { byId, relPaths, count };
}

function normalizeDashboardPath(value) {
  return path.posix.normalize(value.replaceAll('\\', '/'));
}

function validateDashboardTaskWiki(task, index, taskFiles) {
  const id = task.id;
  const wiki = typeof task.wiki === 'string' ? task.wiki.trim() : '';

  if (wiki.length > 0) {
    const normalizedWiki = normalizeDashboardPath(wiki);

    if (normalizedWiki.startsWith('../') || path.posix.isAbsolute(normalizedWiki)) {
      issues.push(`dashboard.tasks[${index}] ${id}: wiki 必须是仓库内相对路径，当前为 ${wiki}`);
      return;
    }

    if (!normalizedWiki.startsWith('docs/project-os/tasks/')) {
      issues.push(`dashboard.tasks[${index}] ${id}: wiki 必须指向 docs/project-os/tasks/T-*.md，当前为 ${wiki}`);
      return;
    }

    const wikiFileName = path.posix.basename(normalizedWiki);
    const wikiId = extractTaskIdFromFilename(wikiFileName);

    if (!wikiId) {
      issues.push(`dashboard.tasks[${index}] ${id}: wiki 文件名必须匹配 T-xxx*.md，当前为 ${wikiFileName}`);
      return;
    }

    if (wikiId !== id) {
      issues.push(`dashboard.tasks[${index}] ${id}: wiki 文件名 ID 为 ${wikiId}，与任务 ID 不一致`);
    }

    if (!taskFiles.relPaths.has(normalizedWiki)) {
      issues.push(`dashboard.tasks[${index}] ${id}: 找不到 wiki 指向的任务文档 ${normalizedWiki}`);
    }

    return;
  }

  const candidates = taskFiles.byId.get(id) ?? [];

  if (candidates.length === 0) {
    issues.push(`dashboard.tasks[${index}] ${id}: 未配置 wiki，且找不到对应 tasks/${id}*.md`);
  } else if (candidates.length > 1) {
    issues.push(`dashboard.tasks[${index}] ${id}: 未配置 wiki，且存在多个候选任务文档：${candidates.join(', ')}`);
  }
}

function validateDashboardTasks(data, taskFiles) {
  const taskById = new Map();

  if (!data) {
    return taskById;
  }

  if (!Array.isArray(data.tasks)) {
    issues.push('dashboard.tasks: 缺失或不是数组');
    return taskById;
  }

  const issueCountBefore = issues.length;

  data.tasks.forEach((task, index) => {
    if (!task || typeof task !== 'object') {
      issues.push(`dashboard.tasks[${index}]: 必须是对象`);
      return;
    }

    if (!taskIdPattern.test(task.id ?? '')) {
      issues.push(`dashboard.tasks[${index}]: id 必须匹配 T-xxx，当前为 ${String(task.id)}`);
      return;
    }

    if (taskById.has(task.id)) {
      issues.push(`dashboard.tasks[${index}] ${task.id}: dashboard tasks 中 ID 重复`);
    }

    taskById.set(task.id, task);
    validateDashboardTaskWiki(task, index, taskFiles);
  });

  if (issues.length === issueCountBefore) {
    checks.push('dashboard.tasks 中每个 T-xxx 都能找到对应 task markdown');
  }

  return taskById;
}

function parseMarkdownTableRow(line) {
  const trimmed = line.trim();

  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) {
    return null;
  }

  return trimmed
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim());
}

function isSeparatorRow(cells) {
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function parseTaskBoardRows(text) {
  const rows = [];
  let header = null;

  text.split(/\r?\n/).forEach((line, lineIndex) => {
    const cells = parseMarkdownTableRow(line);

    if (!cells) {
      return;
    }

    if (!header && cells.includes('ID') && cells.includes('状态')) {
      header = {
        id: cells.indexOf('ID'),
        title: cells.indexOf('标题'),
        owner: cells.indexOf('负责人'),
        status: cells.indexOf('状态'),
      };
      return;
    }

    if (!header || isSeparatorRow(cells)) {
      return;
    }

    const id = cells[header.id]?.replaceAll('`', '').trim();

    if (!taskIdPattern.test(id ?? '')) {
      return;
    }

    rows.push({
      id,
      title: cells[header.title] ?? '',
      owner: cells[header.owner] ?? '',
      status: cells[header.status] ?? '',
      line: lineIndex + 1,
    });
  });

  return rows;
}

function validateCompletedTaskBoardRows(taskBoardText, dashboardTaskById) {
  if (taskBoardText === null) {
    return;
  }

  const issueCountBefore = issues.length;
  const rows = parseTaskBoardRows(taskBoardText);

  if (rows.length === 0) {
    issues.push('TASK_BOARD.md: 未能解析到任务表格中的 T-xxx 行');
    return;
  }

  const completedRows = rows.filter((row) => row.status === '已完成');

  completedRows.forEach((row) => {
    const dashboardTask = dashboardTaskById.get(row.id);

    if (!dashboardTask) {
      issues.push(`TASK_BOARD.md:${row.line} ${row.id}: 状态为“已完成”，但 dashboard.tasks 中不存在该任务`);
      return;
    }

    if (dashboardTask.status !== 'done') {
      issues.push(`TASK_BOARD.md:${row.line} ${row.id}: 状态为“已完成”，但 dashboard status=${String(dashboardTask.status)}`);
    }

    if (dashboardTask.progress !== 100) {
      issues.push(`TASK_BOARD.md:${row.line} ${row.id}: 状态为“已完成”，但 dashboard progress=${String(dashboardTask.progress)}`);
    }
  });

  if (issues.length === issueCountBefore) {
    checks.push('TASK_BOARD.md 已完成任务均为 dashboard status=done 且 progress=100');
  }
}

function getSection(text, headingPattern) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => headingPattern.test(line));

  if (start === -1) {
    return null;
  }

  let end = lines.length;

  for (let index = start + 1; index < lines.length; index += 1) {
    if (/^##\s+/.test(lines[index])) {
      end = index;
      break;
    }
  }

  return {
    startLine: start + 1,
    text: lines.slice(start, end).join('\n'),
  };
}

function extractCheckedPhaseTaskIds(sectionText) {
  const ids = new Set();

  sectionText.split(/\r?\n/).forEach((line) => {
    if (!/^\s*-\s*\[x\]/i.test(line)) {
      return;
    }

    for (const match of line.matchAll(/\bT-\d{3}\b/g)) {
      ids.add(match[0]);
    }
  });

  return [...ids].sort();
}

function validateRoadmapPhase0(roadmapText, data) {
  if (roadmapText === null || !data) {
    return;
  }

  const phase0Section = getSection(roadmapText, /^##\s+Phase 0[：:]/);

  if (!phase0Section) {
    issues.push('ROADMAP.md: 未找到 Phase 0 段落');
    return;
  }

  const checkedTaskIds = extractCheckedPhaseTaskIds(phase0Section.text);

  if (checkedTaskIds.length === 0) {
    checks.push('ROADMAP.md Phase 0 没有已勾选完成的 T-xxx 项');
    return;
  }

  if (!Array.isArray(data.roadmap)) {
    issues.push('dashboard.roadmap: 缺失或不是数组');
    return;
  }

  const dashboardPhase0 = data.roadmap.find((phase) => phase?.id === 'phase-0');

  if (!dashboardPhase0 || !Array.isArray(dashboardPhase0.items)) {
    issues.push('dashboard.roadmap: 未找到 phase-0.items');
    return;
  }

  const issueCountBefore = issues.length;

  checkedTaskIds.forEach((id) => {
    const matches = dashboardPhase0.items.filter((item) => typeof item?.title === 'string' && item.title.includes(id));

    if (matches.length === 0) {
      issues.push(`ROADMAP.md Phase 0: ${id} 已勾选完成，但 dashboard roadmap phase-0.items 中找不到对应项`);
      return;
    }

    matches.forEach((item) => {
      if (item.done === false) {
        issues.push(`ROADMAP.md Phase 0: ${id} 已勾选完成，但 dashboard roadmap phase-0 item "${item.title}" 仍为 done:false`);
      }
    });
  });

  if (issues.length === issueCountBefore) {
    checks.push('ROADMAP.md Phase 0 已完成 T-xxx 在 dashboard phase-0.items 中未标记为 done:false');
  }
}

function validateSummary(summaryText) {
  if (summaryText === null) {
    return;
  }

  const t008Section = getSection(summaryText, /^##\s+T-008 当前阶段\s*$/);

  if (!t008Section) {
    issues.push('summary.md: 未找到 “## T-008 当前阶段” 段落');
    return;
  }

  if (!/\bT-008\b/.test(t008Section.text) || !/只读/.test(t008Section.text) || !/校验脚本/.test(t008Section.text)) {
    issues.push(`summary.md:${t008Section.startLine}: T-008 当前阶段说明必须包含 T-008、只读、校验脚本`);
    return;
  }

  checks.push('summary.md 可读到当前 T-008 阶段说明');
}

const [
  taskBoardText,
  roadmapText,
  summaryText,
  dashboardText,
  rootDashboardText,
  taskFiles,
] = await Promise.all([
  readText('TASK_BOARD.md', paths.taskBoard),
  readText('ROADMAP.md', paths.roadmap),
  readText('summary.md', paths.summary),
  readText('dashboard/dashboard.json', paths.dashboard),
  readText('dashboard.json', paths.rootDashboard),
  readTaskMarkdownFiles(),
]);

const dashboardData = parseJson('dashboard/dashboard.json', paths.dashboard, dashboardText);
parseJson('dashboard.json', paths.rootDashboard, rootDashboardText);

if (dashboardText !== null && rootDashboardText !== null) {
  if (dashboardText === rootDashboardText) {
    checks.push('两个 dashboard JSON 内容完全一致');
  } else {
    issues.push('两个 dashboard JSON 内容不完全一致：docs/project-os/dashboard/dashboard.json 与 docs/project-os/dashboard.json 存在差异');
  }
}

const dashboardTaskById = validateDashboardTasks(dashboardData, taskFiles);
validateCompletedTaskBoardRows(taskBoardText, dashboardTaskById);
validateRoadmapPhase0(roadmapText, dashboardData);
validateSummary(summaryText);

console.log('Dev OS Consistency Validator');
console.log(issues.length === 0 ? 'PASS' : 'FAIL');
console.log('');
console.log('检查项:');
checks.forEach((check) => {
  console.log(`- ${check}`);
});
console.log('');
console.log('问题列表:');

if (issues.length === 0) {
  console.log('- 无');
} else {
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue}`);
  });
}

process.exit(issues.length === 0 ? 0 : 1);
