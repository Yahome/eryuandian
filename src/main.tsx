import React from 'react';
import ReactDOM from 'react-dom/client';
import dashboardData from '../docs/project-os/dashboard/dashboard.json';
import logoUrl from '../pic/brand-logo-identity.png';
import './styles.css';

type Status = 'done' | 'active' | 'ready' | 'planned' | 'open' | 'monitoring' | 'in_progress' | 'pending' | string;

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

const navigation = [
  { label: '总览', href: '/dev-dashboard', state: null },
  { label: '任务看板', href: '#任务看板', state: 'Coming soon' },
  { label: 'Agent 状态', href: '#Agent 状态', state: 'Coming soon' },
  { label: '项目 Wiki', href: '#project-wiki', state: '可用' },
  { label: '风险与决策', href: '#风险与决策', state: 'Coming soon' },
  { label: '日报', href: '#日报', state: 'Coming soon' },
  { label: '设置', href: '#设置', state: 'Coming soon' },
];
const projectTitle = '两元店 Dev OS';
const markdownModules = import.meta.glob('../docs/project-os/**/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const markdownByPath = createMarkdownRegistry(markdownModules);
const markdownPaths = Object.keys(markdownByPath).sort((a, b) => a.localeCompare(b));
const wikiModel = createWikiModel(dashboardData.wikiLinks);

function statusLabel(status: Status) {
  const labels: Record<string, string> = {
    done: '已完成',
    active: '活跃',
    ready: '就绪',
    planned: '计划中',
    open: '开放',
    monitoring: '监控中',
    in_progress: '进行中',
    pending: '待开始',
    review: '待验收',
  };
  return labels[status] ?? status;
}

function statusTone(status: Status) {
  if (['done', 'active'].includes(status)) return 'success';
  if (['ready', 'in_progress', 'monitoring', 'review'].includes(status)) return 'warning';
  if (['open'].includes(status)) return 'danger';
  return 'muted';
}

function averageProgress(tasks: Task[]) {
  if (tasks.length === 0) return 0;
  return Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length);
}

function countByStatus<T extends { status: string }>(items: T[], statuses: string[]) {
  return items.filter((item) => statuses.includes(item.status)).length;
}

function blockedTasks(tasks: Task[], risks: Risk[]) {
  return countByStatus(tasks, ['blocked']) + risks.filter((risk) => risk.status === 'open').length;
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
  const progress = averageProgress(data.tasks);
  const activeAgents = countByStatus(data.agents, ['active']);
  const inProgressTasks = countByStatus(data.tasks, ['in_progress', 'ready']);
  const blockedCount = blockedTasks(data.tasks, data.risks);
  const latestUpdate = data.recentUpdates[0]?.date ?? data.project.updatedAt;
  const currentSprint = data.roadmap.find((phase) => phase.status === 'in_progress')?.title ?? data.project.phase;
  const healthStatus = data.risks.some((risk) => risk.status === 'open') ? '需关注' : '健康';

  const kpis = [
    { label: '整体进度', value: `${progress}%`, hint: `${data.tasks.length} 个任务平均进度` },
    { label: '进行中任务', value: String(inProgressTasks), hint: 'ready / in_progress' },
    { label: '阻塞任务', value: String(blockedCount), hint: 'blocked 任务 + open 风险' },
    { label: '活跃 Agent', value: `${activeAgents}/${data.agents.length}`, hint: 'active agents' },
    { label: '最近更新', value: latestUpdate, hint: data.recentUpdates[0]?.title ?? '暂无更新' },
  ];

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <img src={logoUrl} alt="两元店 AI创作好帮手" />
          <span>Dev OS</span>
        </div>
        <nav className="nav-list" aria-label="Dev OS navigation">
          {navigation.map((item, index) => (
            <a className={index === 0 ? 'nav-item active' : 'nav-item'} href={item.href} key={item.label}>
              <span>{item.label}</span>
              {item.state ? <small>{item.state}</small> : null}
            </a>
          ))}
        </nav>
      </aside>

      <section className="content-panel">
        <header className="hero card gradient-card">
          <div>
            <p className="eyebrow">{data.project.phase} · {data.project.slug}</p>
            <h1>{projectTitle}</h1>
            <p>{data.project.principle}</p>
          </div>
          <div className="hero-badge">
            <span>{data.project.updatedAt}</span>
            <strong>{data.project.status}</strong>
          </div>
        </header>

        <section className="kpi-grid" aria-label="KPI">
          {kpis.map((kpi) => (
            <article className="card kpi-card" key={kpi.label}>
              <span>{kpi.label}</span>
              <strong>{kpi.value}</strong>
              <small>{kpi.hint}</small>
            </article>
          ))}
        </section>

        <section className="layout-grid">
          <article className="card overview-card">
            <SectionTitle title="项目总览" subtitle="Project Overview" />
            <div className="overview-row"><span>当前阶段</span><strong>{data.project.phase}</strong></div>
            <div className="overview-row"><span>Sprint</span><strong>{currentSprint}</strong></div>
            <div className="overview-row"><span>健康状态</span><strong className={`pill ${healthStatus === '健康' ? 'success' : 'warning'}`}>{healthStatus}</strong></div>
            <p className="muted-text">{data.project.currentFocus}</p>
          </article>

          <article className="card agents-card">
            <SectionTitle title="Agent 状态" subtitle={`${data.agents.length} profiles`} />
            <div className="agent-list">
              {data.agents.map((agent: Agent) => (
                <div className="agent-item" key={agent.id}>
                  <div>
                    <strong>{agent.name}</strong>
                    <span>{agent.role}</span>
                  </div>
                  <Badge status={agent.status} />
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="card roadmap-card">
          <SectionTitle title="Roadmap" subtitle="Phase 0 ~ Phase 4" />
          <div className="roadmap-list">
            {data.roadmap.map((phase: RoadmapPhase) => (
              <article className="phase-card" key={phase.id}>
                <Badge status={phase.status} />
                <h3>{phase.title}</h3>
                <ul>
                  {phase.items.map((item) => (
                    <li key={item.title} className={item.done ? 'done' : ''}>{item.title}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <ProjectWikiViewer updates={data.recentUpdates} />

        <section className="bottom-grid">
          <ListCard title="风险与阻塞" subtitle="Risks" items={data.risks.map((risk) => ({ key: risk.id, title: risk.title, meta: `${statusLabel(risk.status)} · ${risk.impact}`, tone: statusTone(risk.status) }))} />
          <ListCard title="待你确认" subtitle="Pending Approvals" items={data.pendingApprovals.map((approval) => ({ key: approval.id, title: approval.title, meta: approval.source, tone: 'warning' }))} />
          <ListCard title="最近更新" subtitle="Recent Updates" items={data.recentUpdates.map((update) => ({ key: `${update.date}-${update.title}`, title: update.title, meta: `${update.date} · ${update.description}`, tone: 'success' }))} />
        </section>
      </section>
    </main>
  );
}

function ProjectWikiViewer({ updates }: { updates: RecentUpdate[] }) {
  const [selectedPath, setSelectedPath] = React.useState(wikiModel.entries[0]?.path ?? '');
  const selectedEntry = wikiModel.entryMap.get(selectedPath) ?? wikiModel.entries[0];

  const handleSelect = React.useCallback((path: string) => {
    if (wikiModel.entryMap.has(path)) {
      setSelectedPath(path);
    }
  }, []);

  return (
    <section className="card wiki-viewer" id="project-wiki">
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
  return <span className={`pill ${statusTone(status)}`}>{statusLabel(status)}</span>;
}

function ListCard({ title, subtitle, items }: { title: string; subtitle: string; items: Array<{ key: string; title: string; meta: string; tone: string }> }) {
  return (
    <article className="card list-card">
      <SectionTitle title={title} subtitle={subtitle} />
      <div className="stack-list">
        {items.map((item) => (
          <div className="stack-item" key={item.key}>
            <span className={`dot ${item.tone}`} />
            <div>
              <strong>{item.title}</strong>
              <p>{item.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DevDashboard />
  </React.StrictMode>,
);
