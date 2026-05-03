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

const navigation = ['总览', '任务看板', 'Agent 状态', '项目 Wiki', '风险与决策', '日报', '设置'];
const projectTitle = '两元店 Dev OS';

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
  };
  return labels[status] ?? status;
}

function statusTone(status: Status) {
  if (['done', 'active'].includes(status)) return 'success';
  if (['ready', 'in_progress', 'monitoring'].includes(status)) return 'warning';
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
            <a className={index === 0 ? 'nav-item active' : 'nav-item'} href={index === 0 ? '/dev-dashboard' : `#${item}`} key={item}>
              <span>{item}</span>
              {index !== 0 ? <small>Coming soon</small> : null}
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

        <section className="bottom-grid">
          <ListCard title="风险与阻塞" subtitle="Risks" items={data.risks.map((risk) => ({ key: risk.id, title: risk.title, meta: `${statusLabel(risk.status)} · ${risk.impact}`, tone: statusTone(risk.status) }))} />
          <ListCard title="待你确认" subtitle="Pending Approvals" items={data.pendingApprovals.map((approval) => ({ key: approval.id, title: approval.title, meta: approval.source, tone: 'warning' }))} />
          <ListCard title="最近更新" subtitle="Recent Updates" items={data.recentUpdates.map((update) => ({ key: `${update.date}-${update.title}`, title: update.title, meta: `${update.date} · ${update.description}`, tone: 'success' }))} />
          <article className="card wiki-card">
            <SectionTitle title="Wiki 快速入口" subtitle="Source of Truth" />
            <div className="wiki-links">
              {data.wikiLinks.map((link) => (
                <a href={`/${link.path}`} key={link.path}>
                  <span>{link.title}</span>
                  <small>{link.type}</small>
                </a>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
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
