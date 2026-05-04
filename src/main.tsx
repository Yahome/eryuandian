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

const projectTitle = '两元店 Dev OS';
const navigation = [
  { label: '总览', href: '#overview', state: null, icon: 'overview' },
  { label: '任务看板', href: '#task-board', state: '可用', icon: 'tasks' },
  { label: 'Agent 状态', href: '#agents', state: null, icon: 'agent' },
  { label: '项目 Wiki', href: '#project-wiki', state: '可用', icon: 'wiki' },
  { label: '风险与决策', href: '#risks', state: 'Coming soon', icon: 'risk' },
  { label: '日报', href: '#daily', state: 'Coming soon', icon: 'daily' },
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
const wikiModel = createWikiModel(dashboardData.wikiLinks);
const completedTaskStatuses = ['done', 'completed', 'success', 'succeeded'];
const reviewTaskStatuses = ['review', 'reviewing'];
const taskStatusGroups = [
  { key: 'ready', label: '准备中', statuses: ['ready'] },
  { key: 'in_progress', label: '进行中', statuses: ['in_progress'] },
  { key: 'review', label: '审核中', statuses: reviewTaskStatuses },
  { key: 'blocked', label: '已阻塞', statuses: ['blocked'] },
  { key: 'done', label: '已完成', statuses: completedTaskStatuses },
  { key: 'pending', label: '待处理 / 待办', statuses: ['pending', 'todo'] },
  { key: 'other', label: '其他状态', statuses: [] },
];

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

function blockedTasks(tasks: Task[], risks: Risk[]) {
  return countByStatus(tasks, ['blocked']) + risks.filter((risk) => risk.status === 'open').length;
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

function activeTaskCount(tasks: Task[]) {
  return countByStatus(tasks, ['in_progress', 'ready', ...reviewTaskStatuses]);
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

function taskStatusGroupKey(status: string) {
  const matchedGroup = taskStatusGroups.find((group) => group.statuses.includes(status));
  return matchedGroup?.key ?? 'other';
}

function groupTasksByStatus(tasks: Task[]) {
  const grouped = new Map(taskStatusGroups.map((group) => [group.key, [] as Task[]]));

  for (const task of tasks) {
    grouped.get(taskStatusGroupKey(task.status))?.push(task);
  }

  return taskStatusGroups.map((group) => ({
    ...group,
    tasks: grouped.get(group.key) ?? [],
  }));
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
  const groupItems = new Map<string, WikiIndexItem[]>();
  const entries: WikiEntry[] = [];
  const seenPaths = new Set<string>();

  function addGroupItem(type: string, item: WikiIndexItem) {
    const items = groupItems.get(type) ?? [];
    items.push(item);
    groupItems.set(type, items);
  }

  function addEntry(entry: WikiEntry) {
    if (!seenPaths.has(entry.path)) {
      seenPaths.add(entry.path);
      entries.push(entry);
    }

    return entry;
  }

  for (const link of wikiLinks) {
    if (isSafeMarkdownPath(link.path)) {
      const entry = addEntry({
        title: link.title,
        path: link.path,
        type: link.type,
        sourceTitle: link.title,
        directoryChild: false,
      });

      addGroupItem(link.type, { kind: 'file', entry });
      continue;
    }

    if (isSafeDirectoryPath(link.path)) {
      const directoryEntries = markdownPaths
        .filter((path) => isDirectDirectoryChild(link.path, path))
        .map((path) => addEntry({
          title: titleFromMarkdown(path, markdownByPath[path]),
          path,
          type: link.type,
          sourceTitle: link.title,
          directoryChild: true,
        }));

      addGroupItem(link.type, {
        kind: 'directory',
        title: link.title,
        path: link.path,
        type: link.type,
        entries: directoryEntries,
      });
    }
  }

  return {
    groups: Array.from(groupItems.entries()).map(([type, items]) => ({
      type,
      label: wikiTypeLabel(type),
      items,
    })),
    entries,
    entryMap: new Map(entries.map((entry) => [entry.path, entry])),
    allowedPaths: new Set(entries.map((entry) => entry.path)),
  };
}

function wikiTypeLabel(type: string) {
  const labels: Record<string, string> = {
    overview: '总览',
    product: '产品',
    planning: '规划',
    tasks: '任务',
    decisions: '决策',
    risks: '风险',
    schema: '结构',
    agents: 'Agent',
  };

  return labels[type] ?? type;
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
  const progress = averageProgress(data.tasks);
  const activeAgents = countByStatus(data.agents, ['active']);
  const inProgressTasks = activeTaskCount(data.tasks);
  const blockedCount = blockedTasks(data.tasks, data.risks);
  const latestUpdate = data.recentUpdates[0];
  const currentPhase = data.roadmap.find((phase) => phase.status === 'in_progress') ?? data.roadmap[0];
  const healthStatus = data.risks.some((risk) => risk.status === 'open') ? '需关注' : '状态良好';
  const currentPhaseProgress = currentPhase ? phaseProgress(currentPhase) : progress;
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
    { label: '整体进度', value: `${progress}%`, hint: `${data.tasks.length} 个任务平均进度`, icon: 'trend' as const, tone: 'blue' },
    { label: '进行中任务', value: String(inProgressTasks), hint: 'ready / in_progress / review', icon: 'tasks' as const, tone: 'violet' },
    { label: '阻塞任务', value: String(blockedCount), hint: 'blocked 任务 + open 风险', icon: 'risk' as const, tone: 'red' },
    { label: '活跃 Agent', value: String(activeAgents), hint: `${data.agents.length} 个 profiles`, icon: 'agent' as const, tone: 'green' },
    { label: '最近更新', value: String(data.recentUpdates.length), hint: latestUpdate ? latestUpdate.title : data.project.updatedAt, icon: 'clock' as const, tone: 'sky' },
  ];

  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-main">
        <TopHeader
          status={data.project.status}
          title={projectTitle}
          updatedAt={data.project.updatedAt}
        />

        <section className="kpi-grid" aria-label="Dev OS KPI">
          {kpis.map((kpi) => (
            <KpiCard
              hint={kpi.hint}
              icon={kpi.icon}
              key={kpi.label}
              label={kpi.label}
              progress={kpi.label === '整体进度' ? progress : undefined}
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
            healthStatus={healthStatus}
            progress={progress}
          />

          <AgentStatusGrid agents={data.agents} />
        </section>

        <section className="work-grid">
          <RoadmapTimeline phases={data.roadmap} />
          <div className="side-stack">
            <RiskApprovalCard approvals={data.pendingApprovals} risks={data.risks} />
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
        <WikiQuickLinks links={data.wikiLinks} />
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

function TopHeader({ title, status, updatedAt }: { title: string; status: string; updatedAt: string }) {
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
        <button className="user-chip" type="button" aria-label="用户占位">
          <span className="avatar"><Icon name="user" /></span>
          <span>
            <strong>张小圆</strong>
            <small>项目负责人 · {updatedAt}</small>
          </span>
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
  healthStatus,
  progress,
}: {
  data: DashboardData;
  currentPhase?: RoadmapPhase;
  currentPhaseProgress: number;
  healthStatus: string;
  progress: number;
}) {
  const taskStatusSegments = [
    { label: '已完成', value: percentage(countByStatus(data.tasks, ['done']), data.tasks.length), tone: 'done' },
    { label: '进行中', value: percentage(activeTaskCount(data.tasks), data.tasks.length), tone: 'active' },
    { label: '未开始', value: percentage(countByStatus(data.tasks, ['planned', 'pending']), data.tasks.length), tone: 'pending' },
  ];

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

      <div className="overview-facts">
        <InfoPair label="当前 Sprint" value={currentPhase?.title ?? data.project.phase} />
        <InfoPair label="健康状态" value={healthStatus} tone={healthStatus === '状态良好' ? 'success' : 'warning'} />
        <InfoPair label="阶段进度" value={`${currentPhaseProgress}%`} />
      </div>

      <div className="progress-summary">
        <div className="progress-heading">
          <span>整体任务进度</span>
          <strong>{progress}%</strong>
        </div>
        <div className="stacked-progress" aria-label={`整体任务进度 ${progress}%`}>
          {taskStatusSegments.map((segment) => (
            <span
              className={`segment ${segment.tone}`}
              key={segment.label}
              style={{ width: `${segment.value}%` }}
            />
          ))}
        </div>
        <div className="progress-legend">
          {taskStatusSegments.map((segment) => (
            <span key={segment.label}><i className={segment.tone} />{segment.label} {segment.value}%</span>
          ))}
        </div>
      </div>
    </article>
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

function AgentStatusGrid({ agents }: { agents: Agent[] }) {
  return (
    <section className="dashboard-card agents-card" id="agents">
      <SectionTitle title="Agent 状态" subtitle={`${agents.length} profiles · dashboard.json`} />
      <div className="agent-grid">
        {agents.map((agent) => (
          <article className="agent-tile" key={agent.id}>
            <div className="agent-head">
              <span className={`agent-avatar ${statusTone(agent.status)}`}>
                <Icon name="agent" />
              </span>
              <Badge status={agent.status} />
            </div>
            <strong>{agent.name}</strong>
            <span>{agent.role}</span>
            <div className="agent-meta">
              <small>最近进展</small>
              <p>{agent.progress.at(-1) ?? '暂无进展'}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RoadmapTimeline({ phases }: { phases: RoadmapPhase[] }) {
  return (
    <section className="dashboard-card roadmap-card">
      <SectionTitle title="里程碑 / Roadmap" subtitle="Phase 0 ~ Phase 4" />
      <div className="timeline">
        {phases.map((phase) => {
          const progress = phaseProgress(phase);

          return (
            <article className={phase.status === 'in_progress' ? 'timeline-item current' : 'timeline-item'} key={phase.id}>
              <div className="timeline-dot"><Icon name={phase.status === 'done' ? 'check' : 'daily'} /></div>
              <div className="timeline-copy">
                <Badge status={phase.status} />
                <h3>{shortPhaseTitle(phase.title)}</h3>
                <p>{phase.title.includes('：') ? phase.title.split('：').slice(1).join('：') : phase.title}</p>
                <span>{progress}% · {phase.items.filter((item) => item.done).length}/{phase.items.length} 项完成</span>
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
  const [selectedTaskId, setSelectedTaskId] = React.useState(tasks[0]?.id ?? '');
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? tasks[0];
  const stats = React.useMemo(() => taskStats(tasks), [tasks]);
  const groupedTasks = React.useMemo(() => groupTasksByStatus(tasks), [tasks]);

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

      <div className="task-board-layout">
        <div className="task-columns" aria-label="按状态分组任务">
          {groupedTasks.map((group) => (
            <TaskColumn
              group={group}
              key={group.key}
              onOpenWiki={onOpenWiki}
              onSelectTask={handleSelectTask}
              selectedTaskId={selectedTask?.id ?? ''}
            />
          ))}
        </div>

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

function TaskColumn({
  group,
  selectedTaskId,
  onSelectTask,
  onOpenWiki,
}: {
  group: ReturnType<typeof groupTasksByStatus>[number];
  selectedTaskId: string;
  onSelectTask: (taskId: string) => void;
  onOpenWiki: (path: string) => void;
}) {
  return (
    <section className={`task-column status-${group.key}`}>
      <div className="task-column-header">
        <div>
          <h3>{group.label}</h3>
          <small>{group.statuses.length > 0 ? group.statuses.join(' / ') : 'fallback'}</small>
        </div>
        <span>{group.tasks.length}</span>
      </div>

      <div className="task-column-list">
        {group.tasks.length > 0 ? group.tasks.map((task) => (
          <TaskCard
            isSelected={task.id === selectedTaskId}
            key={task.id}
            onOpenWiki={onOpenWiki}
            onSelect={onSelectTask}
            task={task}
          />
        )) : (
          <p className="task-empty-state">暂无该状态任务</p>
        )}
      </div>
    </section>
  );
}

function TaskCard({
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
    <article className={isSelected ? 'task-card selected' : 'task-card'}>
      <button className="task-card-button" type="button" aria-pressed={isSelected} onClick={() => onSelect(task.id)}>
        <span className="task-card-topline">
          <span className="task-card-id">{task.id}</span>
          <span className="task-priority">{task.priority}</span>
        </span>
        <strong>{task.title}</strong>
        <span className="task-card-meta">
          <span>Owner <b>{task.owner}</b></span>
          <span>Status <b>{statusLabel(task.status)}</b></span>
          <span>Progress <b>{progress}%</b></span>
        </span>
        <span className="task-progress-track" aria-label={`${task.id} 进度 ${progress}%`}>
          <span style={{ width: `${progress}%` }} />
        </span>
        <span className="task-card-summary">{task.summary}</span>
        <code className="task-wiki-path">{task.wiki}</code>
      </button>
      <TaskWikiLink path={task.wiki} onOpenWiki={onOpenWiki} />
    </article>
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

  return (
    <aside className="task-detail-panel" aria-label={`${task.id} 任务详情`}>
      <div className="task-detail-head">
        <span>{task.id}</span>
        <Badge status={task.status} />
      </div>
      <h3>{task.title}</h3>
      <p>{task.summary}</p>

      <div className="task-detail-facts">
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
        <TaskContextBlock title="风险" subtitle={`${risks.length} risks`}>
          {risks.slice(0, 3).map((risk) => (
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
  variant?: 'default' | 'primary';
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

function WikiQuickLinks({ links }: { links: readonly WikiLink[] }) {
  return (
    <section className="dashboard-card wiki-quick-card">
      <SectionTitle title="Wiki 快速入口" subtitle="只读 Project OS Markdown" />
      <div className="wiki-quick-grid">
        {links.slice(0, 6).map((link) => (
          <a href="#project-wiki" className="wiki-quick-link" key={`${link.type}-${link.path}`}>
            <span className={`wiki-type type-${link.type}`}><Icon name={link.type === 'risks' ? 'risk' : 'wiki'} /></span>
            <div>
              <strong>{link.title}</strong>
              <small>{link.path}</small>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function ProjectWikiViewer({ updates, selectedPath, onSelect }: { updates: RecentUpdate[]; selectedPath: string; onSelect: (path: string) => void }) {
  const selectedEntry = wikiModel.entryMap.get(selectedPath) ?? wikiModel.entries[0];

  const handleSelect = React.useCallback((path: string) => {
    if (wikiModel.entryMap.has(path)) {
      onSelect(path);
    }
  }, [onSelect]);

  return (
    <section className="dashboard-card wiki-viewer" id="project-wiki">
      <div className="wiki-header">
        <SectionTitle title="Project Wiki" subtitle={`${wikiModel.entries.length} Markdown docs · dashboard.json wikiLinks`} />
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
                  <span>{selectedEntry.type}</span>
                  <h2>{selectedEntry.title}</h2>
                  <p>{selectedEntry.path}</p>
                </div>
              </div>
              <MarkdownPreview content={markdownByPath[selectedEntry.path]} currentPath={selectedEntry.path} onNavigate={handleSelect} />
            </>
          ) : (
            <div className="wiki-empty-state">
              <h2>暂无可预览文档</h2>
              <p>当前 wikiLinks 未匹配到 docs/project-os 下的 Markdown 文件。</p>
            </div>
          )}
        </article>

        <WikiUpdatesPanel updates={updates} onSelect={handleSelect} />
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

function WikiUpdatesPanel({ updates, onSelect }: { updates: RecentUpdate[]; onSelect: (path: string) => void }) {
  return (
    <aside className="wiki-updates-panel" aria-label="Recent wiki updates">
      <div className="wiki-updates-title">
        <h3>最近更新</h3>
        <p>Recent Updates</p>
      </div>
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
