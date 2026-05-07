import React from 'react';
import ReactDOM from 'react-dom/client';
import dashboardData from '../docs/project-os/dashboard/dashboard.json';
import logoUrl from './assets/brand-app-icon.png';
import './styles.css';

type Status =
  | 'done'
  | 'completed'
  | 'success'
  | 'succeeded'
  | 'active'
  | 'ready'
  | 'planned'
  | 'open'
  | 'monitoring'
  | 'in_progress'
  | 'pending'
  | 'todo'
  | 'blocked'
  | 'review'
  | 'reviewing'
  | string;

type DashboardData = typeof dashboardData;
type Task = DashboardData['tasks'][number];
type Agent = DashboardData['agents'][number];
type Risk = DashboardData['risks'][number];
type RoadmapPhase = DashboardData['roadmap'][number];
type RecentUpdate = DashboardData['recentUpdates'][number];
type WikiLink = DashboardData['wikiLinks'][number];

type MarkdownBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'code'; language: string; code: string }
  | { type: 'quote'; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'rule' };

type WikiEntry = {
  title: string;
  path: string;
  type: string;
  sourceTitle: string;
  directoryChild: boolean;
};

type WikiIndexItem =
  | { kind: 'file'; entry: WikiEntry }
  | { kind: 'directory'; title: string; path: string; type: string; entries: WikiEntry[] };

type WikiGroup = {
  type: string;
  label: string;
  items: WikiIndexItem[];
};

type WikiModel = {
  groups: WikiGroup[];
  entries: WikiEntry[];
  entryMap: Map<string, WikiEntry>;
  allowedPaths: Set<string>;
};

type ProjectLine = 'Dev OS' | 'Web App';
type TaskStatusFilter = 'all' | 'ready' | 'in_progress' | 'review' | 'blocked' | 'done';
type TaskLineFilter = 'all' | ProjectLine;

const projectTitle = '两元店 Dev OS';
const navigation = [
  { label: '总览', href: '#overview', state: null, icon: 'overview' },
  { label: '任务看板', href: '#task-board', state: '可用', icon: 'tasks' },
  { label: '项目 Wiki', href: '#project-wiki', state: '可用', icon: 'wiki' },
  { label: '里程碑与进度', href: '#milestones', state: null, icon: 'daily' },
  { label: '风险与待确认', href: '#risks', state: null, icon: 'risk' },
  { label: '决策记录', href: '#project-wiki', state: null, icon: 'daily' },
  { label: '变更日志', href: '#project-wiki', state: null, icon: 'trend' },
  { label: '设置', href: '#settings', state: 'Coming soon', icon: 'settings' },
] as const;

const iconPaths = {
  overview: 'M4 13h7V4H4v9Zm0 7h7v-5H4v5Zm9 0h7v-9h-7v9Zm0-11h7V4h-7v5Z',
  tasks: 'M8 5h8M8 12h8M8 19h8M4 5h.01M4 12h.01M4 19h.01',
  agent: 'M12 3v3m-5 5H5a2 2 0 0 0-2 2v3a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5v-3a2 2 0 0 0-2-2h-2M8 11V8a4 4 0 0 1 8 0v3M9 15h.01M15 15h.01',
  wiki: 'M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2V4Zm0 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2m3-12h6m-6 4h5',
  risk: 'M12 3 2.8 19h18.4L12 3Zm0 6v5m0 3h.01',
  daily: 'M7 3v3m10-3v3M4 8h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
  settings: 'M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Zm7.4-3.2c0-.5-.1-.9-.2-1.3l2-1.5-2-3.4-2.4 1a7.7 7.7 0 0 0-2.2-1.3L14.3 3h-4.6l-.4 2.5a7.7 7.7 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.5c-.1.4-.2.8-.2 1.3s.1.9.2 1.3l-2 1.5 2 3.4 2.4-1a7.7 7.7 0 0 0 2.2 1.3l.4 2.5h4.6l.4-2.5a7.7 7.7 0 0 0 2.2-1.3l2.4 1 2-3.4-2-1.5c.1-.4.2-.8.2-1.3Z',
  search: 'm21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-7.7 12a2 2 0 0 0 3.4 0',
  help: 'M9.1 9a3 3 0 1 1 5.6 1.5c-.9 1.1-2.2 1.4-2.2 3M12 17h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  user: 'M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
  rocket: 'M14 4c2.9.6 5.4 3.1 6 6-2.9.6-6.2 2.4-8 4.7L9.3 12C11.6 10.2 13.4 6.9 14 4ZM8 15l-3 3m8-3 3 3M5 13l6 6',
  clock: 'M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  check: 'm5 12 4 4L19 6',
  trend: 'm3 17 6-6 4 4 8-8M14 7h7v7',
} as const;
type IconName = keyof typeof iconPaths;

const markdownModules = import.meta.glob('../docs/project-os/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const markdownByPath = createMarkdownRegistry(markdownModules);
const markdownPaths = Object.keys(markdownByPath).sort((a, b) => a.localeCompare(b));
const wikiGroupDefinitions = [
  { type: 'overview', label: 'Overview' },
  { type: 'process', label: '过程管理文件' },
  { type: 'agents', label: 'Agent 工作流' },
  { type: 'risk-decision', label: '风险与决策' },
  { type: 'dashboard', label: 'Dashboard 相关' },
  { type: 'tasks', label: '任务文档' },
] as const;
const wikiModel = createWikiModel(dashboardData.wikiLinks);
const completedTaskStatuses = ['done', 'completed', 'success', 'succeeded'];
const reviewTaskStatuses = ['review', 'reviewing'];

function statusLabel(status: Status) {
  const labels: Record<string, string> = {
    done: '已完成',
    completed: '已完成',
    success: '已完成',
    succeeded: '已完成',
    active: '活跃',
    ready: '准备中',
    planned: '计划中',
    open: '开放',
    monitoring: '监控中',
    in_progress: '进行中',
    pending: '待处理',
    todo: '待办',
    blocked: '已阻塞',
    review: '审核中',
    reviewing: '审核中',
    failed: '失败',
    cancelled: '已取消',
    canceled: '已取消',
    archived: '已归档',
    draft: '草稿',
  };
  return labels[status] ?? status;
}

function statusTone(status: Status) {
  if (['done', 'completed', 'success', 'succeeded', 'active'].includes(status)) return 'success';
  if (['ready', 'in_progress', 'monitoring', 'review', 'reviewing', 'pending', 'todo'].includes(status)) return 'warning';
  if (['open', 'blocked', 'failed'].includes(status)) return 'danger';
  return 'muted';
}

function averageProgress(tasks: Task[]) {
  if (tasks.length === 0) return 0;
  return Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length);
}

function countByStatus<T extends { status: string }>(items: T[], statuses: readonly string[]) {
  return items.filter((item) => statuses.includes(item.status)).length;
}

function percentage(part: number, total: number) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

function phaseProgress(phase: RoadmapPhase) {
  return percentage(phase.items.filter((item) => item.done).length, phase.items.length);
}

function shortPhaseTitle(title: string) {
  return title.split('：').at(0) ?? title;
}

function statusClassName(status: Status) {
  return `pill ${statusTone(status)}`;
}

function taskStats(tasks: Task[]) {
  return {
    total: tasks.length,
    completed: countByStatus(tasks, completedTaskStatuses),
    ready: countByStatus(tasks, ['ready']),
    inProgress: countByStatus(tasks, ['in_progress']),
    reviewing: countByStatus(tasks, reviewTaskStatuses),
    blocked: countByStatus(tasks, ['blocked']),
    averageProgress: averageProgress(tasks),
  };
}

function isCompletedStatus(status: string) {
  return completedTaskStatuses.includes(status);
}

function taskProjectLine(task: Task): ProjectLine {
  const text = `${task.title} ${task.summary} ${task.wiki}`.toLowerCase();
  const devOsSignals = ['dev os', 'dashboard', 'project os', 'hermes', 'agent', 'wiki', 'reviewer', '事实源', '看板', '校验', '架构'];
  const webAppSignals = ['web app', 'mvp', '登录', '生图', '试卷', '支付', '作品', '会员', '额度', '订单'];

  if (devOsSignals.some((signal) => text.includes(signal))) {
    return 'Dev OS';
  }

  if (webAppSignals.some((signal) => text.includes(signal))) {
    return 'Web App';
  }

  return 'Dev OS';
}

function riskProjectLine(risk: Risk): ProjectLine {
  const text = `${risk.title} ${risk.impact} ${risk.mitigation} ${risk.wiki}`.toLowerCase();
  const webAppSignals = ['web app', 'mvp', '登录', '生图', '试卷', '支付', 'api', '数据模型', '技术栈'];

  return webAppSignals.some((signal) => text.includes(signal)) ? 'Web App' : 'Dev OS';
}

function roadmapItemProjectLine(title: string): ProjectLine {
  const text = title.toLowerCase();
  const devOsSignals = ['dev os', 'dashboard', 'project os', 'hermes', 'agent', 'wiki', 'reviewer', '事实源', '校验', '架构'];

  if (devOsSignals.some((signal) => text.includes(signal))) {
    return 'Dev OS';
  }

  return 'Web App';
}

function devOsCompletion(tasks: Task[]) {
  const devOsTasks = tasks.filter((task) => taskProjectLine(task) === 'Dev OS');

  return {
    total: devOsTasks.length,
    completed: countByStatus(devOsTasks, completedTaskStatuses),
    progress: averageProgress(devOsTasks),
  };
}

function webAppMvpCompletion(phases: RoadmapPhase[]) {
  const mvpPhase = phases.find((phase) => /mvp/i.test(phase.title)) ?? phases.find((phase) => phase.id === 'phase-1');
  const mvpItems = (mvpPhase?.items ?? []).filter((item) => roadmapItemProjectLine(item.title) === 'Web App');

  return {
    total: mvpItems.length,
    completed: mvpItems.filter((item) => item.done).length,
    progress: percentage(mvpItems.filter((item) => item.done).length, mvpItems.length),
    phaseTitle: mvpPhase?.title ?? 'Phase 1：MVP 基础',
  };
}

function taskStatusMatchesFilter(task: Task, filter: TaskStatusFilter) {
  if (filter === 'all') return true;
  if (filter === 'done') return isCompletedStatus(task.status);
  if (filter === 'review') return reviewTaskStatuses.includes(task.status);
  return task.status === filter;
}

function taskSearchText(task: Task) {
  return `${task.id} ${task.title} ${task.summary} ${task.owner} ${task.status} ${statusLabel(task.status)} ${task.priority} ${task.wiki} ${taskProjectLine(task)}`.toLowerCase();
}

function taskSortRank(task: Task) {
  if (task.status === 'in_progress') return 0;
  if (reviewTaskStatuses.includes(task.status)) return 1;
  if (task.status === 'ready' || task.status === 'pending' || task.status === 'todo') return 2;
  if (task.status === 'blocked') return 3;
  if (isCompletedStatus(task.status)) return 6;
  return 4;
}

function filterTasks({
  tasks,
  statusFilter,
  lineFilter,
  ownerFilter,
  priorityFilter,
  query,
  showCompleted,
}: {
  tasks: Task[];
  statusFilter: TaskStatusFilter;
  lineFilter: TaskLineFilter;
  ownerFilter: string;
  priorityFilter: string;
  query: string;
  showCompleted: boolean;
}) {
  const normalizedQuery = query.trim().toLowerCase();

  return tasks
    .filter((task) => statusFilter === 'done' || showCompleted || !isCompletedStatus(task.status))
    .filter((task) => taskStatusMatchesFilter(task, statusFilter))
    .filter((task) => lineFilter === 'all' || taskProjectLine(task) === lineFilter)
    .filter((task) => ownerFilter === 'all' || task.owner === ownerFilter)
    .filter((task) => priorityFilter === 'all' || task.priority === priorityFilter)
    .filter((task) => normalizedQuery === '' || taskSearchText(task).includes(normalizedQuery))
    .sort((a, b) => taskSortRank(a) - taskSortRank(b) || a.id.localeCompare(b.id));
}

function taskRelatedUpdates(task: Task, updates: RecentUpdate[]) {
  return updates
    .filter((update) => (
      update.files.includes(task.wiki)
      || update.title.includes(task.id)
      || update.description.includes(task.id)
    ))
    .slice(0, 3);
}

function clampedProgress(value: number) {
  return Math.min(Math.max(value, 0), 100);
}

function taskIdFromText(text: string) {
  return text.match(/\bT-\d{3}\b/)?.[0] ?? null;
}

function phaseTaskRefs(phase: RoadmapPhase, tasks: Task[]) {
  const taskById = new Map(tasks.map((task) => [task.id, task]));

  return phase.items.map((item) => {
    const taskId = taskIdFromText(item.title);
    return {
      item,
      task: taskId ? taskById.get(taskId) : undefined,
    };
  });
}

function phaseAgents(phase: RoadmapPhase, tasks: Task[], agents: Agent[]) {
  const refs = phaseTaskRefs(phase, tasks);
  const owners = new Set(refs.flatMap((ref) => (ref.task ? [ref.task.owner] : [])));
  const phaseText = `${phase.title} ${phase.items.map((item) => item.title).join(' ')}`.toLowerCase();

  const responsibilityMatches = agents.filter((agent) => {
    if (owners.has(agent.id)) {
      return true;
    }

    return agent.responsibilities.some((responsibility) => {
      const normalized = responsibility.toLowerCase();
      return normalized.length >= 2 && phaseText.includes(normalized);
    });
  });

  return responsibilityMatches.length > 0 ? responsibilityMatches : agents.filter((agent) => owners.has(agent.id));
}

function visiblePhaseTasks(phase: RoadmapPhase, tasks: Task[]) {
  return phaseTaskRefs(phase, tasks).map(({ item, task }) => ({
    id: task?.id ?? taskIdFromText(item.title),
    title: task?.title ?? item.title,
    status: task?.status ?? (item.done ? 'done' : phase.status),
    done: item.done,
    hasTask: Boolean(task),
  }));
}

function wikiEntryForLink(link: WikiLink) {
  if (wikiModel.entryMap.has(link.path)) {
    return wikiModel.entryMap.get(link.path);
  }

  if (isSafeDirectoryPath(link.path)) {
    return wikiModel.entries.find((entry) => isDirectDirectoryChild(link.path, entry.path));
  }

  return undefined;
}

function extractMarkdownSection(markdown: string, headingNames: string[]) {
  const blocks = parseMarkdownBlocks(markdown);
  const startIndex = blocks.findIndex((block) => (
    block.type === 'heading'
    && headingNames.some((name) => block.text.toLowerCase().includes(name.toLowerCase()))
  ));

  if (startIndex === -1) {
    return [];
  }

  const startHeading = blocks[startIndex];

  if (!startHeading || startHeading.type !== 'heading') {
    return [];
  }

  const endIndex = blocks.findIndex((block, index) => (
    index > startIndex
    && block.type === 'heading'
    && block.level <= startHeading.level
  ));
  const sectionBlocks = blocks.slice(startIndex + 1, endIndex === -1 ? undefined : endIndex);

  return sectionBlocks.flatMap((block) => {
    if (block.type === 'list') return block.items;
    if (block.type === 'paragraph') return [block.text];
    if (block.type === 'quote') return [block.text];
    return [];
  }).filter(Boolean).slice(0, 6);
}

function taskAcceptanceItems(task: Task) {
  const markdown = markdownByPath[task.wiki];

  if (!markdown) {
    return [];
  }

  return extractMarkdownSection(markdown, ['验收标准', 'acceptance']);
}

function markdownOutline(content: string) {
  return parseMarkdownBlocks(content)
    .filter((block): block is Extract<MarkdownBlock, { type: 'heading' }> => block.type === 'heading' && block.level <= 3)
    .slice(0, 8);
}

function createMarkdownRegistry(modules: Record<string, string>) {
  const registry: Record<string, string> = {};

  for (const [modulePath, content] of Object.entries(modules)) {
    const projectPath = toProjectMarkdownPath(modulePath);

    if (projectPath) {
      registry[projectPath] = content;
    }
  }

  return registry;
}

function toProjectMarkdownPath(modulePath: string) {
  const normalized = modulePath.replace(/\\/g, '/');
  const projectOsIndex = normalized.indexOf('docs/project-os/');

  if (projectOsIndex === -1 || !normalized.endsWith('.md')) {
    return null;
  }

  const projectPath = normalized.slice(projectOsIndex);
  return isInsideProjectOs(projectPath) ? projectPath : null;
}

function isInsideProjectOs(path: string) {
  return path.startsWith('docs/project-os/') && !path.split('/').includes('..');
}

function isSafeMarkdownPath(path: string) {
  return isInsideProjectOs(path) && path.endsWith('.md') && Object.prototype.hasOwnProperty.call(markdownByPath, path);
}

function isSafeDirectoryPath(path: string) {
  return isInsideProjectOs(path) && path.endsWith('/');
}

function isDirectDirectoryChild(directoryPath: string, filePath: string) {
  if (!filePath.startsWith(directoryPath)) {
    return false;
  }

  const childPath = filePath.slice(directoryPath.length);
  return childPath.endsWith('.md') && !childPath.includes('/');
}

function createWikiModel(wikiLinks: readonly WikiLink[]): WikiModel {
  const entries: WikiEntry[] = [];
  const seenPaths = new Set<string>();
  const linkByPath = new Map(wikiLinks.map((link) => [link.path, link]));
  const directoryLinks = wikiLinks.filter((link) => isSafeDirectoryPath(link.path));

  function addEntry(entry: WikiEntry): WikiEntry | null {
    if (!seenPaths.has(entry.path)) {
      seenPaths.add(entry.path);
      entries.push(entry);
      return entry;
    }

    return null;
  }

  for (const link of wikiLinks) {
    if (isSafeMarkdownPath(link.path)) {
      addEntry({
        title: link.title,
        path: link.path,
        type: link.type,
        sourceTitle: link.title,
        directoryChild: false,
      });
      continue;
    }

    if (isSafeDirectoryPath(link.path)) {
      markdownPaths
        .filter((path) => isDirectDirectoryChild(link.path, path))
        .map((path) => addEntry({
          title: titleFromMarkdown(path, markdownByPath[path]),
          path,
          type: link.type,
          sourceTitle: link.title,
          directoryChild: true,
        }));
    }
  }

  for (const path of markdownPaths) {
    const matchingDirectory = directoryLinks.find((link) => isDirectDirectoryChild(link.path, path));
    const linked = linkByPath.get(path);

    addEntry({
      title: linked?.title ?? titleFromMarkdown(path, markdownByPath[path]),
      path,
      type: linked?.type ?? matchingDirectory?.type ?? wikiGroupKeyForPath(path),
      sourceTitle: linked?.title ?? matchingDirectory?.title ?? 'Markdown registry',
      directoryChild: Boolean(matchingDirectory),
    });
  }

  const groupedEntries = new Map<string, WikiEntry[]>();

  for (const entry of entries) {
    const groupKey = wikiGroupKeyForPath(entry.path);
    const groupEntries = groupedEntries.get(groupKey) ?? [];
    groupEntries.push(entry);
    groupedEntries.set(groupKey, groupEntries);
  }

  return {
    groups: wikiGroupDefinitions
      .map((group) => ({
        type: group.type,
        label: group.label,
        items: (groupedEntries.get(group.type) ?? []).map((entry) => ({ kind: 'file' as const, entry })),
      }))
      .filter((group) => group.items.length > 0),
    entries,
    entryMap: new Map(entries.map((entry) => [entry.path, entry])),
    allowedPaths: new Set(entries.map((entry) => entry.path)),
  };
}

function wikiGroupKeyForPath(path: string) {
  if (path.includes('/tasks/')) return 'tasks';
  if (path.includes('/agents/') || path.endsWith('/AGENT_WORKFLOW.md')) return 'agents';
  if (path.includes('/dashboard/') || path.endsWith('/dashboard.json')) return 'dashboard';
  if (path.endsWith('/RISKS.md') || path.endsWith('/DECISIONS.md')) return 'risk-decision';
  if (path.endsWith('/ROADMAP.md') || path.endsWith('/TASK_BOARD.md') || path.endsWith('/CHANGELOG.md')) return 'process';
  return 'overview';
}

function titleFromMarkdown(path: string, markdown: string) {
  const frontMatterTitle = markdown.match(/^---[\s\S]*?\ntitle:\s*["']?([^"'\n]+)["']?[\s\S]*?\n---/);

  if (frontMatterTitle?.[1]) {
    return frontMatterTitle[1].trim();
  }

  const headingTitle = markdown.match(/^#\s+(.+)$/m);

  if (headingTitle?.[1]) {
    return headingTitle[1].trim();
  }

  return path.split('/').at(-1)?.replace(/\.md$/, '') ?? path;
}

function normalizeMarkdown(markdown: string) {
  const normalized = markdown.replace(/\r\n/g, '\n');

  if (!normalized.startsWith('---\n')) {
    return normalized;
  }

  const frontMatterEnd = normalized.indexOf('\n---\n', 4);
  return frontMatterEnd === -1 ? normalized : normalized.slice(frontMatterEnd + 5);
}

function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  const lines = normalizeMarkdown(markdown).split('\n');
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === '') {
      index += 1;
      continue;
    }

    if (line.trim().startsWith('```')) {
      const language = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }

      if (index < lines.length) {
        index += 1;
      }

      blocks.push({ type: 'code', language, code: codeLines.join('\n') });
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
      index += 1;
      continue;
    }

    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push({ type: 'rule' });
      index += 1;
      continue;
    }

    if (isTableStart(lines, index)) {
      const headers = splitTableRow(line);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length && lines[index].includes('|') && lines[index].trim() !== '') {
        rows.push(splitTableRow(lines[index]));
        index += 1;
      }

      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quoteLines: string[] = [];

      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ''));
        index += 1;
      }

      blocks.push({ type: 'quote', text: quoteLines.join('\n') });
      continue;
    }

    if (/^\s*(?:[-*+]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items: string[] = [];

      while (index < lines.length && /^\s*(?:[-*+]|\d+\.)\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*(?:[-*+]|\d+\.)\s+/, ''));
        index += 1;
      }

      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    const paragraphLines: string[] = [];

    while (index < lines.length && lines[index].trim() !== '' && !isBlockBoundary(lines, index)) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
  }

  return blocks;
}

function isBlockBoundary(lines: string[], index: number) {
  const line = lines[index];

  if (index === 0) {
    return false;
  }

  return (
    line.trim().startsWith('```')
    || /^(#{1,6})\s+/.test(line)
    || /^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)
    || isTableStart(lines, index)
    || /^\s*>\s?/.test(line)
    || /^\s*(?:[-*+]|\d+\.)\s+/.test(line)
  );
}

function isTableStart(lines: string[], index: number) {
  if (!lines[index]?.includes('|') || !lines[index + 1]?.includes('|')) {
    return false;
  }

  const separatorCells = splitTableRow(lines[index + 1]);
  return separatorCells.length > 0 && separatorCells.every((cell) => /^:?-{3,}:?$/.test(cell.trim()));
}

function splitTableRow(row: string) {
  return row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

function normalizePathSegments(input: string) {
  const segments: string[] = [];

  for (const segment of input.split('/')) {
    if (!segment || segment === '.') {
      continue;
    }

    if (segment === '..') {
      if (segments.length === 0) {
        return null;
      }

      segments.pop();
      continue;
    }

    segments.push(segment);
  }

  return segments.join('/');
}

function resolveInternalMarkdownPath(href: string, currentPath: string) {
  const [hrefWithoutHash] = href.trim().split('#');
  const [hrefWithoutQuery] = hrefWithoutHash.split('?');
  const cleanHref = hrefWithoutQuery.replace(/^\/+/, '');

  if (!cleanHref.endsWith('.md')) {
    return null;
  }

  const candidate = cleanHref.startsWith('docs/project-os/')
    ? normalizePathSegments(cleanHref)
    : normalizePathSegments(`${currentPath.slice(0, currentPath.lastIndexOf('/') + 1)}${cleanHref}`);

  if (!candidate || !wikiModel.allowedPaths.has(candidate)) {
    return null;
  }

  return candidate;
}

function safeExternalHref(href: string) {
  try {
    const url = new URL(href);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

function renderInline(text: string, currentPath: string, onNavigate: (path: string) => void) {
  const nodes: React.ReactNode[] = [];
  const tokenPattern = /(!?\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*\n]+\*)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(text)) !== null) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index));
    }

    const token = match[0];

    if (token.startsWith('`')) {
      nodes.push(<code className="inline-code" key={`${match.index}-code`}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith('**')) {
      nodes.push(<strong key={`${match.index}-strong`}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*')) {
      nodes.push(<em key={`${match.index}-em`}>{token.slice(1, -1)}</em>);
    } else {
      nodes.push(renderInlineLink(token, currentPath, onNavigate, match.index));
    }

    cursor = match.index + token.length;
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return nodes;
}

function renderInlineLink(token: string, currentPath: string, onNavigate: (path: string) => void, key: number) {
  const imageMatch = token.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);

  if (imageMatch) {
    return (
      <span className="markdown-muted-link" key={`${key}-image`}>
        [image: {imageMatch[1] || imageMatch[2]}] <code className="inline-code">{imageMatch[2].trim()}</code>
      </span>
    );
  }

  const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

  if (!linkMatch) {
    return token;
  }

  const [, label, rawHref] = linkMatch;
  const trimmedHref = rawHref.trim();
  const internalPath = resolveInternalMarkdownPath(trimmedHref, currentPath);

  if (internalPath) {
    return (
      <button className="markdown-inline-link" key={`${key}-internal`} type="button" onClick={() => onNavigate(internalPath)}>
        {label}
      </button>
    );
  }

  const externalHref = safeExternalHref(trimmedHref);

  if (externalHref) {
    return (
      <a href={externalHref} key={`${key}-external`} target="_blank" rel="noreferrer noopener">
        {label}
      </a>
    );
  }

  return (
    <span className="markdown-muted-link" key={`${key}-muted`}>
      {label} <code className="inline-code">{trimmedHref}</code>
    </span>
  );
}

function DevDashboard() {
  const data = dashboardData;
  const [selectedWikiPath, setSelectedWikiPath] = React.useState(() => wikiModel.entries[0]?.path ?? '');
  const devOsStats = React.useMemo(() => devOsCompletion(data.tasks), [data.tasks]);
  const webAppMvpStats = React.useMemo(() => webAppMvpCompletion(data.roadmap), [data.roadmap]);
  const currentPhase = data.roadmap.find((phase) => phase.status === 'in_progress') ?? data.roadmap[0];
  const healthStatus = data.risks.some((risk) => risk.status === 'open') ? '需关注' : '状态良好';
  const currentPhaseProgress = currentPhase ? phaseProgress(currentPhase) : devOsStats.progress;
  const currentTask = data.tasks
    .filter((task) => ['in_progress', 'review', 'reviewing', 'ready', 'blocked'].includes(task.status))
    .sort((a, b) => taskSortRank(a) - taskSortRank(b) || a.id.localeCompare(b.id))[0];
  const handleWikiSelect = React.useCallback((path: string) => {
    if (wikiModel.entryMap.has(path)) {
      setSelectedWikiPath(path);
    }
  }, []);
  const handleOpenTaskWiki = React.useCallback((path: string) => {
    if (!wikiModel.entryMap.has(path)) {
      return;
    }

    setSelectedWikiPath(path);
    window.requestAnimationFrame(() => {
      document.getElementById('project-wiki')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const kpis = [
    { label: 'Dev OS 完成度', value: `${devOsStats.progress}%`, hint: `${devOsStats.completed}/${devOsStats.total} 个 Dev OS 任务完成`, icon: 'trend' as const, tone: 'blue', progress: devOsStats.progress },
    { label: 'Web App MVP', value: `${webAppMvpStats.progress}%`, hint: `${webAppMvpStats.completed}/${webAppMvpStats.total} 个 MVP 前置项完成`, icon: 'rocket' as const, tone: 'violet', progress: webAppMvpStats.progress },
    { label: '当前里程碑', value: shortPhaseTitle(currentPhase?.title ?? data.project.phase), hint: `${currentPhaseProgress}% · ${statusLabel(currentPhase?.status ?? data.project.status)}`, icon: 'daily' as const, tone: 'green' },
    { label: '当前任务', value: currentTask?.id ?? '-', hint: currentTask?.title ?? '暂无进行中任务', icon: 'tasks' as const, tone: 'sky' },
  ];

  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-main">
        <TopHeader
          status={data.project.status}
          title={projectTitle}
        />

        <section className="kpi-grid" aria-label="Dev OS KPI">
          {kpis.map((kpi) => (
            <KpiCard
              hint={kpi.hint}
              icon={kpi.icon}
              key={kpi.label}
              label={kpi.label}
              progress={kpi.progress}
              tone={kpi.tone}
              value={kpi.value}
            />
          ))}
        </section>

        <section className="dashboard-grid" id="overview">
          <ProjectOverviewCard
            currentPhase={currentPhase}
            currentPhaseProgress={currentPhaseProgress}
            data={data}
            devOsStats={devOsStats}
            healthStatus={healthStatus}
            webAppMvpStats={webAppMvpStats}
          />
          <RiskApprovalCard approvals={data.pendingApprovals} risks={data.risks} />
        </section>

        <section className="work-grid" id="milestones">
          <RoadmapTimeline agents={data.agents} phases={data.roadmap} tasks={data.tasks} />
          <div className="side-stack">
            <RecentUpdatesCard updates={data.recentUpdates} />
          </div>
        </section>

        <TaskBoardSection
          approvals={data.pendingApprovals}
          onOpenWiki={handleOpenTaskWiki}
          recentUpdates={data.recentUpdates}
          risks={data.risks}
          tasks={data.tasks}
        />
        <WikiQuickLinks links={data.wikiLinks} onOpenWiki={handleOpenTaskWiki} selectedPath={selectedWikiPath} />
        <ProjectWikiViewer onSelect={handleWikiSelect} selectedPath={selectedWikiPath} updates={data.recentUpdates} />
      </main>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <BrandLockup />
      <nav className="nav-list" aria-label="Dev OS navigation">
        {navigation.map((item, index) => (
          <a className={index === 0 ? 'nav-item active' : 'nav-item'} href={item.href} key={item.label}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {item.state ? <small>{item.state}</small> : null}
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <img src={logoUrl} alt="" />
        <div>
          <strong>Dev OS</strong>
          <span>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}

function BrandLockup() {
  return (
    <a className="brand-lockup" href="#overview" aria-label="两元店 Dev OS 总览">
      <img src={logoUrl} alt="两元店" />
      <div>
        <strong>两元店</strong>
        <span>AI创作好帮手</span>
      </div>
    </a>
  );
}

function TopHeader({ title, status }: { title: string; status: string }) {
  return (
    <header className="top-header">
      <div className="title-block">
        <h1>{title}</h1>
        <p>{status}</p>
      </div>

      <label className="search-box">
        <Icon name="search" />
        <input aria-label="搜索项目、任务、文档、Agent" placeholder="搜索项目、任务、文档、Agent..." readOnly />
        <kbd>⌘ K</kbd>
      </label>

      <div className="header-actions" aria-label="Header placeholders">
        <button className="icon-button with-badge" type="button" aria-label="通知占位">
          <Icon name="bell" />
          <span>3</span>
        </button>
        <button className="icon-button" type="button" aria-label="帮助占位">
          <Icon name="help" />
        </button>
      </div>
    </header>
  );
}

function KpiCard({ label, value, hint, icon, tone, progress }: { label: string; value: string; hint: string; icon: IconName; tone: string; progress?: number }) {
  return (
    <article className={`dashboard-card kpi-card tone-${tone}`}>
      <div className="kpi-visual">
        {typeof progress === 'number'
          ? <ProgressRing value={progress} />
          : (
            <span className="kpi-icon">
              <Icon name={icon} />
            </span>
          )}
      </div>
      <div>
        <span className="card-label">{label}</span>
        <strong>{value}</strong>
        <small>{hint}</small>
      </div>
    </article>
  );
}

function ProgressRing({ value }: { value: number }) {
  const degrees = Math.min(Math.max(value, 0), 100) * 3.6;

  return (
    <span
      className="progress-ring"
      style={{ background: `conic-gradient(#2f6bff ${degrees}deg, #e8ebf7 0deg)` }}
      aria-label={`进度 ${value}%`}
    >
      <span />
    </span>
  );
}

function ProjectOverviewCard({
  data,
  currentPhase,
  currentPhaseProgress,
  devOsStats,
  healthStatus,
  webAppMvpStats,
}: {
  data: DashboardData;
  currentPhase?: RoadmapPhase;
  currentPhaseProgress: number;
  devOsStats: ReturnType<typeof devOsCompletion>;
  healthStatus: string;
  webAppMvpStats: ReturnType<typeof webAppMvpCompletion>;
}) {
  return (
    <article className="dashboard-card overview-card">
      <SectionTitle title="项目总览" subtitle={data.project.principle} />

      <div className="overview-topline">
        <span className="overview-icon"><Icon name="rocket" /></span>
        <div>
          <span>当前阶段</span>
          <strong>{data.project.phase}</strong>
          <p>{data.project.currentFocus}</p>
        </div>
      </div>

      <div className="overview-progress-grid">
        <ProgressTrackCard
          description="Dev OS Dashboard v1.0 正在收尾，当前进度来自 Dev OS 任务平均值。"
          done={devOsStats.completed}
          label="Dev OS 完成度"
          progress={devOsStats.progress}
          tone="blue"
          total={devOsStats.total}
        />
        <ProgressTrackCard
          description="Web App MVP 仍处于 Phase 1 开工前准备，业务功能尚未启动。"
          done={webAppMvpStats.completed}
          label="Web App MVP 完成度"
          progress={webAppMvpStats.progress}
          tone="green"
          total={webAppMvpStats.total}
        />
      </div>

      <div className="overview-facts">
        <InfoPair label="当前 Sprint" value={currentPhase?.title ?? data.project.phase} />
        <InfoPair label="健康状态" value={healthStatus} tone={healthStatus === '状态良好' ? 'success' : 'warning'} />
        <InfoPair label="阶段进度" value={`${currentPhaseProgress}%`} />
        <InfoPair label="下一阶段" value={webAppMvpStats.phaseTitle} />
      </div>
    </article>
  );
}

function ProgressTrackCard({
  label,
  progress,
  done,
  total,
  description,
  tone,
}: {
  label: string;
  progress: number;
  done: number;
  total: number;
  description: string;
  tone: 'blue' | 'green';
}) {
  return (
    <div className={`progress-track-card ${tone}`}>
      <div className="progress-heading">
        <span>{label}</span>
        <strong>{progress}%</strong>
      </div>
      <span className="task-progress-track" aria-label={`${label} ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </span>
      <p>{description}</p>
      <small>{done}/{total} 项完成</small>
    </div>
  );
}

function InfoPair({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="info-pair">
      <span>{label}</span>
      {tone ? <strong className={`pill ${tone}`}>{value}</strong> : <strong>{value}</strong>}
    </div>
  );
}

function RoadmapTimeline({ phases, tasks, agents }: { phases: RoadmapPhase[]; tasks: Task[]; agents: Agent[] }) {
  return (
    <section className="dashboard-card roadmap-card">
      <SectionTitle title="里程碑与 Agent 状态" subtitle="Phase 0 ~ Phase 4 · roadmap + agents" />
      <div className="phase-table" role="table" aria-label="里程碑与 Agent 状态">
        <div className="phase-table-head" role="row">
          <span>阶段</span>
          <span>状态 / 进度</span>
          <span>关联 Agent</span>
          <span>关联任务</span>
        </div>
        {phases.map((phase) => {
          const progress = phaseProgress(phase);
          const phaseRelatedAgents = phaseAgents(phase, tasks, agents);
          const phaseTasks = visiblePhaseTasks(phase, tasks);

          return (
            <article className={phase.status === 'in_progress' ? 'phase-row current' : 'phase-row'} key={phase.id} role="row">
              <div className="phase-name">
                <span className="timeline-dot"><Icon name={phase.status === 'done' ? 'check' : 'daily'} /></span>
                <div>
                  <h3>{shortPhaseTitle(phase.title)}</h3>
                  <p>{phase.title.includes('：') ? phase.title.split('：').slice(1).join('：') : phase.title}</p>
                </div>
              </div>
              <div className="phase-progress">
                <Badge status={phase.status} />
                <strong>{progress}%</strong>
                <span className="task-progress-track" aria-label={`${phase.title} 进度 ${progress}%`}>
                  <span style={{ width: `${progress}%` }} />
                </span>
                <small>{phase.items.filter((item) => item.done).length}/{phase.items.length} 项完成</small>
              </div>
              <div className="phase-agents">
                {phaseRelatedAgents.length > 0 ? phaseRelatedAgents.map((agent) => (
                  <span className={`agent-chip ${statusTone(agent.status)}`} key={agent.id}>
                    <Icon name="agent" />
                    {agent.name}
                  </span>
                )) : <span className="empty-inline">待分配</span>}
              </div>
              <div className="phase-tasks">
                {phaseTasks.slice(0, 4).map((item) => (
                  <span className={item.hasTask ? 'phase-task-chip' : 'phase-task-chip ghost'} key={`${phase.id}-${item.title}`}>
                    {item.id ? <b>{item.id}</b> : null}
                    {item.title}
                    <small>{statusLabel(item.status)}</small>
                  </span>
                ))}
                {phaseTasks.length > 4 ? <span className="empty-inline">+{phaseTasks.length - 4} 项</span> : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RiskApprovalCard({ risks, approvals }: { risks: Risk[]; approvals: DashboardData['pendingApprovals'] }) {
  const riskItems = risks.slice(0, 3).map((risk) => ({
    key: risk.id,
    title: risk.title,
    meta: `${statusLabel(risk.status)} · ${risk.impact}`,
    tone: statusTone(risk.status),
  }));
  const approvalItems = approvals.slice(0, 3).map((approval) => ({
    key: approval.id,
    title: approval.title,
    meta: approval.source,
    tone: 'warning',
  }));

  return (
    <section className="dashboard-card compact-list-card" id="risks">
      <SectionTitle title="风险与待确认" subtitle={`${risks.length} risks · ${approvals.length} approvals`} />
      <div className="compact-list">
        {[...riskItems, ...approvalItems].map((item) => (
          <div className="compact-row" key={item.key}>
            <span className={`status-dot ${item.tone}`} />
            <div>
              <strong>{item.title}</strong>
              <p>{item.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentUpdatesCard({ updates }: { updates: RecentUpdate[] }) {
  return (
    <section className="dashboard-card compact-list-card">
      <SectionTitle title="最近更新" subtitle={`${updates.length} records`} />
      <div className="update-timeline">
        {updates.slice(0, 5).map((update) => (
          <article key={`${update.date}-${update.title}`}>
            <time>{update.date}</time>
            <strong>{update.title}</strong>
            <p>{update.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TaskBoardSection({
  tasks,
  risks,
  approvals,
  recentUpdates,
  onOpenWiki,
}: {
  tasks: Task[];
  risks: Risk[];
  approvals: DashboardData['pendingApprovals'];
  recentUpdates: RecentUpdate[];
  onOpenWiki: (path: string) => void;
}) {
  const initialTask = tasks
    .filter((task) => !isCompletedStatus(task.status))
    .sort((a, b) => taskSortRank(a) - taskSortRank(b) || a.id.localeCompare(b.id))[0] ?? tasks[0];
  const [selectedTaskId, setSelectedTaskId] = React.useState(initialTask?.id ?? '');
  const [statusFilter, setStatusFilter] = React.useState<TaskStatusFilter>('all');
  const [lineFilter, setLineFilter] = React.useState<TaskLineFilter>('all');
  const [ownerFilter, setOwnerFilter] = React.useState('all');
  const [priorityFilter, setPriorityFilter] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [showCompleted, setShowCompleted] = React.useState(false);
  const stats = React.useMemo(() => taskStats(tasks), [tasks]);
  const ownerOptions = React.useMemo(() => Array.from(new Set(tasks.map((task) => task.owner))).sort(), [tasks]);
  const priorityOptions = React.useMemo(() => Array.from(new Set(tasks.map((task) => task.priority))).sort(), [tasks]);
  const visibleTasks = React.useMemo(() => filterTasks({
    tasks,
    statusFilter,
    lineFilter,
    ownerFilter,
    priorityFilter,
    query,
    showCompleted,
  }), [lineFilter, ownerFilter, priorityFilter, query, showCompleted, statusFilter, tasks]);
  const selectedTask = visibleTasks.find((task) => task.id === selectedTaskId) ?? visibleTasks[0] ?? tasks.find((task) => task.id === selectedTaskId) ?? tasks[0];

  const handleSelectTask = React.useCallback((taskId: string) => {
    setSelectedTaskId(taskId);
  }, []);

  return (
    <section className="dashboard-card task-board-card" id="task-board">
      <div className="task-board-header">
        <SectionTitle title="任务看板" subtitle={`${tasks.length} tasks · dashboard.json.tasks`} />
        <span className="pill wiki-lock">只读</span>
      </div>

      <TaskStatsGrid stats={stats} />

      <TaskFilterBar
        lineFilter={lineFilter}
        onLineChange={setLineFilter}
        onOwnerChange={setOwnerFilter}
        onPriorityChange={setPriorityFilter}
        onQueryChange={setQuery}
        onShowCompletedChange={setShowCompleted}
        onStatusChange={setStatusFilter}
        ownerFilter={ownerFilter}
        ownerOptions={ownerOptions}
        priorityFilter={priorityFilter}
        priorityOptions={priorityOptions}
        query={query}
        showCompleted={showCompleted}
        statusFilter={statusFilter}
        tasks={tasks}
      />

      <div className="task-board-layout">
        <TaskList
          onOpenWiki={onOpenWiki}
          onSelectTask={handleSelectTask}
          selectedTaskId={selectedTask?.id ?? ''}
          tasks={visibleTasks}
        />

        <TaskDetailPanel
          approvals={approvals}
          onOpenWiki={onOpenWiki}
          recentUpdates={recentUpdates}
          risks={risks}
          task={selectedTask}
        />
      </div>
    </section>
  );
}

function TaskFilterBar({
  tasks,
  statusFilter,
  lineFilter,
  ownerFilter,
  priorityFilter,
  query,
  showCompleted,
  ownerOptions,
  priorityOptions,
  onStatusChange,
  onLineChange,
  onOwnerChange,
  onPriorityChange,
  onQueryChange,
  onShowCompletedChange,
}: {
  tasks: Task[];
  statusFilter: TaskStatusFilter;
  lineFilter: TaskLineFilter;
  ownerFilter: string;
  priorityFilter: string;
  query: string;
  showCompleted: boolean;
  ownerOptions: string[];
  priorityOptions: string[];
  onStatusChange: (value: TaskStatusFilter) => void;
  onLineChange: (value: TaskLineFilter) => void;
  onOwnerChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  onShowCompletedChange: (value: boolean) => void;
}) {
  const statusFilters: Array<{ value: TaskStatusFilter; label: string; count: number }> = [
    { value: 'all', label: '全部', count: tasks.filter((task) => showCompleted || !isCompletedStatus(task.status)).length },
    { value: 'in_progress', label: '进行中', count: countByStatus(tasks, ['in_progress']) },
    { value: 'ready', label: '准备中', count: countByStatus(tasks, ['ready']) },
    { value: 'review', label: '审核中', count: countByStatus(tasks, reviewTaskStatuses) },
    { value: 'blocked', label: '阻塞', count: countByStatus(tasks, ['blocked']) },
    { value: 'done', label: '已完成', count: countByStatus(tasks, completedTaskStatuses) },
  ];

  return (
    <div className="task-filter-bar" aria-label="任务筛选">
      <div className="task-status-tabs">
        {statusFilters.map((item) => (
          <button
            className={statusFilter === item.value ? 'filter-chip active' : 'filter-chip'}
            key={item.value}
            type="button"
            onClick={() => onStatusChange(item.value)}
          >
            {item.label}
            <span>{item.count}</span>
          </button>
        ))}
      </div>

      <div className="task-filter-controls">
        <label>
          <span>项目线</span>
          <select value={lineFilter} onChange={(event) => onLineChange(event.target.value as TaskLineFilter)}>
            <option value="all">全部项目线</option>
            <option value="Dev OS">Dev OS</option>
            <option value="Web App">Web App</option>
          </select>
        </label>
        <label>
          <span>Owner</span>
          <select value={ownerFilter} onChange={(event) => onOwnerChange(event.target.value)}>
            <option value="all">全部 Agent</option>
            {ownerOptions.map((owner) => <option value={owner} key={owner}>{owner}</option>)}
          </select>
        </label>
        <label>
          <span>优先级</span>
          <select value={priorityFilter} onChange={(event) => onPriorityChange(event.target.value)}>
            <option value="all">全部优先级</option>
            {priorityOptions.map((priority) => <option value={priority} key={priority}>{priority}</option>)}
          </select>
        </label>
        <label className="task-search-control">
          <span>搜索</span>
          <input value={query} placeholder="搜索任务..." onChange={(event) => onQueryChange(event.target.value)} />
        </label>
        <label className="task-toggle-control">
          <input type="checkbox" checked={showCompleted} onChange={(event) => onShowCompletedChange(event.target.checked)} />
          <span>显示已完成</span>
        </label>
      </div>
    </div>
  );
}

function TaskList({
  tasks,
  selectedTaskId,
  onSelectTask,
  onOpenWiki,
}: {
  tasks: Task[];
  selectedTaskId: string;
  onSelectTask: (taskId: string) => void;
  onOpenWiki: (path: string) => void;
}) {
  return (
    <section className="task-list-panel" aria-label="任务列表">
      <div className="task-list-header">
        <span>任务</span>
        <span>项目线</span>
        <span>状态</span>
        <span>进度</span>
        <span>Owner</span>
        <span>优先级</span>
        <span>Markdown</span>
      </div>
      <div className="task-list-body">
        {tasks.length > 0 ? tasks.map((task) => (
          <TaskListRow
            isSelected={task.id === selectedTaskId}
            key={task.id}
            onOpenWiki={onOpenWiki}
            onSelect={onSelectTask}
            task={task}
          />
        )) : (
          <p className="task-empty-state">当前筛选下暂无任务。可切换状态、项目线或打开“显示已完成”。</p>
        )}
      </div>
    </section>
  );
}

function TaskListRow({
  task,
  isSelected,
  onSelect,
  onOpenWiki,
}: {
  task: Task;
  isSelected: boolean;
  onSelect: (taskId: string) => void;
  onOpenWiki: (path: string) => void;
}) {
  const progress = clampedProgress(task.progress);

  return (
    <article className={isSelected ? 'task-list-row selected' : 'task-list-row'}>
      <button className="task-list-main" type="button" aria-pressed={isSelected} onClick={() => onSelect(task.id)}>
        <span className="task-title-cell">
          <b>{task.id}</b>
          <strong>{task.title}</strong>
          <small>{task.summary}</small>
        </span>
        <span className="task-line-chip">{taskProjectLine(task)}</span>
        <Badge status={task.status} />
        <span className="task-list-progress">
          <span className="task-progress-track" aria-label={`${task.id} 进度 ${progress}%`}>
            <span style={{ width: `${progress}%` }} />
          </span>
          <small>{progress}%</small>
        </span>
        <span className="task-owner-cell">{task.owner}</span>
        <span className="task-priority">{task.priority}</span>
      </button>
      <TaskWikiLink path={task.wiki} onOpenWiki={onOpenWiki} variant="compact" />
    </article>
  );
}

function TaskStatsGrid({ stats }: { stats: ReturnType<typeof taskStats> }) {
  const statItems = [
    { label: '总任务数', value: String(stats.total), hint: 'dashboard.json.tasks' },
    { label: '已完成', value: String(stats.completed), hint: completedTaskStatuses.join(' / ') },
    { label: '准备中', value: String(stats.ready), hint: 'ready' },
    { label: '进行中', value: String(stats.inProgress), hint: 'in_progress' },
    { label: '审核中', value: String(stats.reviewing), hint: reviewTaskStatuses.join(' / ') },
    { label: '已阻塞', value: String(stats.blocked), hint: 'blocked' },
    { label: '平均进度', value: `${stats.averageProgress}%`, hint: 'progress 平均值' },
  ];

  return (
    <div className="task-stat-grid" aria-label="任务统计">
      {statItems.map((item) => (
        <div className="task-stat-card" key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <small>{item.hint}</small>
        </div>
      ))}
    </div>
  );
}

function TaskDetailPanel({
  task,
  risks,
  approvals,
  recentUpdates,
  onOpenWiki,
}: {
  task?: Task;
  risks: Risk[];
  approvals: DashboardData['pendingApprovals'];
  recentUpdates: RecentUpdate[];
  onOpenWiki: (path: string) => void;
}) {
  if (!task) {
    return (
      <aside className="task-detail-panel">
        <div className="task-empty-detail">
          <h3>暂无任务</h3>
          <p>dashboard.json.tasks 当前为空。</p>
        </div>
      </aside>
    );
  }

  const progress = clampedProgress(task.progress);
  const relatedUpdates = taskRelatedUpdates(task, recentUpdates);
  const visibleUpdates = relatedUpdates.length > 0 ? relatedUpdates : recentUpdates.slice(0, 3);
  const acceptanceItems = taskAcceptanceItems(task);
  const currentLine = taskProjectLine(task);
  const relatedRisks = risks.filter((risk) => riskProjectLine(risk) === currentLine).slice(0, 3);
  const visibleRisks = relatedRisks.length > 0 ? relatedRisks : risks.slice(0, 3);

  return (
    <aside className="task-detail-panel" aria-label={`${task.id} 任务详情`}>
      <div className="task-detail-head">
        <span>{task.id}</span>
        <Badge status={task.status} />
      </div>
      <h3>{task.title}</h3>
      <p>{task.summary}</p>

      <div className="task-detail-facts">
        <TaskFact label="项目线" value={currentLine} />
        <TaskFact label="Owner" value={task.owner} />
        <TaskFact label="Priority" value={task.priority} />
        <TaskFact label="Status" value={statusLabel(task.status)} />
        <TaskFact label="Progress" value={`${progress}%`} />
      </div>

      <div className="task-detail-progress">
        <div>
          <span>进度</span>
          <strong>{progress}%</strong>
        </div>
        <span className="task-progress-track">
          <span style={{ width: `${progress}%` }} />
        </span>
      </div>

      <div className="task-detail-wiki">
        <span>Task Markdown</span>
        <code>{task.wiki}</code>
        <TaskWikiLink path={task.wiki} onOpenWiki={onOpenWiki} variant="primary" />
      </div>

      <div className="task-context-stack">
        <TaskContextBlock title="验收标准" subtitle={acceptanceItems.length > 0 ? `${acceptanceItems.length} items` : 'from Markdown'}>
          {acceptanceItems.length > 0 ? acceptanceItems.map((item) => (
            <div className="task-context-row check-row" key={item}>
              <span className="task-check-box" />
              <p>{item.replace(/^\[[ xX]\]\s*/, '')}</p>
            </div>
          )) : (
            <p className="task-empty-state">任务文档未提供验收标准。</p>
          )}
        </TaskContextBlock>

        <TaskContextBlock title="关联风险" subtitle={`${visibleRisks.length} shown`}>
          {visibleRisks.map((risk) => (
            <div className="task-context-row" key={risk.id}>
              <Badge status={risk.status} />
              <strong>{risk.title}</strong>
              <p>{risk.impact}</p>
            </div>
          ))}
        </TaskContextBlock>

        <TaskContextBlock title="待确认" subtitle={`${approvals.length} approvals`}>
          {approvals.slice(0, 3).map((approval) => (
            <div className="task-context-row" key={approval.id}>
              <span className="task-context-id">{approval.id}</span>
              <strong>{approval.title}</strong>
              <p>{approval.owner} · {approval.source}</p>
            </div>
          ))}
        </TaskContextBlock>

        <TaskContextBlock title={relatedUpdates.length > 0 ? '关联最近更新' : '最近更新'} subtitle={`${visibleUpdates.length} records`}>
          {visibleUpdates.length > 0 ? visibleUpdates.map((update) => (
            <div className="task-context-row" key={`${update.date}-${update.title}`}>
              <time>{update.date}</time>
              <strong>{update.title}</strong>
              <p>{update.description}</p>
            </div>
          )) : (
            <p className="task-empty-state">dashboard.json.recentUpdates 当前为空</p>
          )}
        </TaskContextBlock>
      </div>
    </aside>
  );
}

function TaskFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="task-detail-fact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TaskWikiLink({
  path,
  onOpenWiki,
  variant = 'default',
}: {
  path: string;
  onOpenWiki: (path: string) => void;
  variant?: 'default' | 'primary' | 'compact';
}) {
  if (!wikiModel.entryMap.has(path)) {
    return <span className={`task-wiki-action ${variant} disabled`}>Wiki 未收录</span>;
  }

  return (
    <a className={`task-wiki-action ${variant}`} href="#project-wiki" onClick={() => onOpenWiki(path)}>
      <Icon name="wiki" />
      <span>Project Wiki</span>
    </a>
  );
}

function TaskContextBlock({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="task-context-block">
      <div className="task-context-heading">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      <div className="task-context-list">
        {children}
      </div>
    </section>
  );
}

function WikiQuickLinks({ links, selectedPath, onOpenWiki }: { links: readonly WikiLink[]; selectedPath: string; onOpenWiki: (path: string) => void }) {
  return (
    <section className="dashboard-card wiki-quick-card">
      <SectionTitle title="Wiki 快速入口" subtitle="只读 Project OS Markdown" />
      <div className="wiki-quick-grid">
        {links.slice(0, 8).map((link) => {
          const entry = wikiEntryForLink(link);
          const isActive = entry?.path === selectedPath;

          return (
            <a
              href="#project-wiki"
              className={isActive ? 'wiki-quick-link active' : 'wiki-quick-link'}
              key={`${link.type}-${link.path}`}
              onClick={(event) => {
                if (!entry) {
                  return;
                }

                event.preventDefault();
                onOpenWiki(entry.path);
              }}
            >
              <span className={`wiki-type type-${link.type}`}><Icon name={link.type === 'risks' ? 'risk' : 'wiki'} /></span>
              <div>
                <strong>{link.title}</strong>
                <small>{entry?.path ?? link.path}</small>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function ProjectWikiViewer({ updates, selectedPath, onSelect }: { updates: RecentUpdate[]; selectedPath: string; onSelect: (path: string) => void }) {
  const selectedEntry = wikiModel.entryMap.get(selectedPath) ?? wikiModel.entries[0];
  const selectedContent = selectedEntry ? markdownByPath[selectedEntry.path] : '';
  const outline = selectedContent ? markdownOutline(selectedContent) : [];

  const handleSelect = React.useCallback((path: string) => {
    if (wikiModel.entryMap.has(path)) {
      onSelect(path);
    }
  }, [onSelect]);

  return (
    <section className="wiki-viewer" id="project-wiki">
      <div className="wiki-header">
        <SectionTitle title="Project Wiki" subtitle={`${wikiModel.entries.length} Markdown docs · immersive reader`} />
        <span className="pill wiki-lock">只读预览</span>
      </div>

      <div className="wiki-viewer-grid">
        <aside className="wiki-index-panel" aria-label="Project Wiki index">
          {wikiModel.groups.map((group) => (
            <section className="wiki-group" key={group.type}>
              <div className="wiki-group-heading">
                <span>{group.label}</span>
                <small>{group.type}</small>
              </div>
              <div className="wiki-index-list">
                {group.items.map((item) => (
                  item.kind === 'file'
                    ? (
                      <WikiEntryButton
                        entry={item.entry}
                        isActive={item.entry.path === selectedEntry?.path}
                        key={item.entry.path}
                        onSelect={handleSelect}
                      />
                    )
                    : (
                      <WikiDirectory
                        activePath={selectedEntry?.path ?? ''}
                        item={item}
                        key={item.path}
                        onSelect={handleSelect}
                      />
                    )
                ))}
              </div>
            </section>
          ))}
        </aside>

        <article className="wiki-document-panel">
          {selectedEntry ? (
            <>
              <div className="wiki-document-toolbar">
                <div>
                  <h2>{selectedEntry.title}</h2>
                  <p>{selectedEntry.path}</p>
                </div>
              </div>
              <MarkdownPreview content={selectedContent} currentPath={selectedEntry.path} onNavigate={handleSelect} />
            </>
          ) : (
            <div className="wiki-empty-state">
              <h2>暂无可预览文档</h2>
              <p>当前 wikiLinks 未匹配到 docs/project-os 下的 Markdown 文件。</p>
            </div>
          )}
        </article>

        <WikiUpdatesPanel outline={outline} updates={updates} onSelect={handleSelect} />
      </div>
    </section>
  );
}

function WikiEntryButton({ entry, isActive, onSelect }: { entry: WikiEntry; isActive: boolean; onSelect: (path: string) => void }) {
  return (
    <button className={isActive ? 'wiki-entry active' : 'wiki-entry'} type="button" onClick={() => onSelect(entry.path)}>
      <span>{entry.title}</span>
      <small>{entry.path}</small>
    </button>
  );
}

function WikiDirectory({ item, activePath, onSelect }: { item: Extract<WikiIndexItem, { kind: 'directory' }>; activePath: string; onSelect: (path: string) => void }) {
  return (
    <details className="wiki-directory" open>
      <summary>
        <span>{item.title}</span>
        <small>{item.entries.length} docs</small>
      </summary>
      <div className="wiki-directory-list">
        {item.entries.map((entry) => (
          <WikiEntryButton entry={entry} isActive={entry.path === activePath} key={entry.path} onSelect={onSelect} />
        ))}
      </div>
    </details>
  );
}

function WikiUpdatesPanel({ updates, outline, onSelect }: { updates: RecentUpdate[]; outline: ReturnType<typeof markdownOutline>; onSelect: (path: string) => void }) {
  return (
    <aside className="wiki-updates-panel" aria-label="Recent wiki updates">
      <div className="wiki-updates-title">
        <h3>更新 / 大纲</h3>
        <p>Updates</p>
      </div>
      {outline.length > 0 ? (
        <div className="wiki-outline-list" aria-label="当前文档大纲">
          {outline.map((heading, index) => (
            <span className={`outline-level-${heading.level}`} key={`${heading.text}-${index}`}>{heading.text}</span>
          ))}
        </div>
      ) : null}
      <div className="wiki-update-list">
        {updates.slice(0, 4).map((update) => (
          <article className="wiki-update" key={`${update.date}-${update.title}`}>
            <span>{update.date}</span>
            <strong>{update.title}</strong>
            <p>{update.description}</p>
            <div className="wiki-update-files">
              {update.files.map((file) => (
                wikiModel.entryMap.has(file)
                  ? (
                    <button type="button" key={file} onClick={() => onSelect(file)}>
                      {file}
                    </button>
                  )
                  : <code key={file}>{file}</code>
              ))}
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}

function MarkdownPreview({ content, currentPath, onNavigate }: { content: string; currentPath: string; onNavigate: (path: string) => void }) {
  const blocks = React.useMemo(() => parseMarkdownBlocks(content), [content]);

  return (
    <div className="markdown-preview">
      {blocks.map((block, index) => renderMarkdownBlock(block, currentPath, onNavigate, index))}
    </div>
  );
}

function renderMarkdownBlock(block: MarkdownBlock, currentPath: string, onNavigate: (path: string) => void, index: number) {
  if (block.type === 'heading') {
    const HeadingTag = `h${Math.min(block.level + 1, 6)}` as keyof React.JSX.IntrinsicElements;
    return <HeadingTag key={index}>{renderInline(block.text, currentPath, onNavigate)}</HeadingTag>;
  }

  if (block.type === 'paragraph') {
    return <p key={index}>{renderInline(block.text, currentPath, onNavigate)}</p>;
  }

  if (block.type === 'list') {
    const ListTag = block.ordered ? 'ol' : 'ul';
    return (
      <ListTag key={index}>
        {block.items.map((item, itemIndex) => (
          <li key={`${index}-${itemIndex}`}>{renderInline(item, currentPath, onNavigate)}</li>
        ))}
      </ListTag>
    );
  }

  if (block.type === 'code') {
    return (
      <pre key={index}>
        <code>{block.code}</code>
      </pre>
    );
  }

  if (block.type === 'quote') {
    return <blockquote key={index}>{block.text}</blockquote>;
  }

  if (block.type === 'table') {
    return (
      <div className="markdown-table-wrap" key={index}>
        <table>
          <thead>
            <tr>
              {block.headers.map((header, headerIndex) => (
                <th key={`${index}-header-${headerIndex}`}>{renderInline(header, currentPath, onNavigate)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={`${index}-row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${index}-cell-${rowIndex}-${cellIndex}`}>{renderInline(cell, currentPath, onNavigate)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <hr key={index} />;
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function Badge({ status }: { status: Status }) {
  return <span className={statusClassName(status)}>{statusLabel(status)}</span>;
}

function Icon({ name }: { name: IconName }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d={iconPaths[name]} />
    </svg>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DevDashboard />
  </React.StrictMode>,
);
