import Link from "next/link";
import { MARKET_PLACEHOLDER, getCopy } from "@/i18n/copy";
import type { SupportedLocale } from "@/i18n/routing";

type LocaleViewProps = {
  locale: SupportedLocale;
};

type WorkspaceVariant = "home" | "dashboard";

export function LandingPage({ locale }: LocaleViewProps) {
  const copy = getCopy(locale);

  return (
    <div className="landing-root">
      <header className="landing-header">
        <Link href={`/${locale}`} className="landing-brand">
          <span className="brand-mark">2</span>
          <span className="brand-copy">
            <strong>{copy.brandName}</strong>
            <small>{copy.brandTagline}</small>
          </span>
        </Link>
        <nav className="landing-locales" aria-label="locale switch">
          <Link className={`locale-pill ${locale === "zh-CN" ? "is-active" : ""}`} href="/zh-CN">
            中文
          </Link>
          <Link className={`locale-pill ${locale === "en" ? "is-active" : ""}`} href="/en">
            EN
          </Link>
        </nav>
      </header>

      <main className="landing-main">
        <section className="landing-hero panel-card">
          <p className="section-eyebrow">{copy.landing.eyebrow}</p>
          <h1>{copy.landing.title}</h1>
          <p>{copy.landing.description}</p>
          <p className="landing-market">{`${copy.marketLabel}: ${MARKET_PLACEHOLDER}`}</p>
          <div className="landing-actions">
            <Link className="primary-button" href={`/${locale}/app`}>
              {copy.landing.primaryAction}
            </Link>
            <Link className="secondary-button" href={`/${locale}/app/dashboard`}>
              {copy.landing.secondaryAction}
            </Link>
          </div>
        </section>

        <section className="landing-grid" aria-label="placeholder entries">
          <article className="entry-card entry-card--violet">
            <h2>{copy.landing.generatorEntryTitle}</h2>
            <p>{copy.landing.generatorEntryBody}</p>
            <Link className="entry-link" href={`/${locale}/app#image-entry`}>
              {copy.workspace.featureImage.cta}
            </Link>
          </article>
          <article className="entry-card entry-card--blue">
            <h2>{copy.landing.paperEntryTitle}</h2>
            <p>{copy.landing.paperEntryBody}</p>
            <Link className="entry-link" href={`/${locale}/app#paper-entry`}>
              {copy.workspace.featurePaper.cta}
            </Link>
          </article>
        </section>

        <p className="static-notice">{copy.landing.staticNotice}</p>
      </main>
    </div>
  );
}

export function AppHomePage({ locale }: LocaleViewProps) {
  return <WorkspacePage locale={locale} variant="home" />;
}

export function DashboardPage({ locale }: LocaleViewProps) {
  return <WorkspacePage locale={locale} variant="dashboard" />;
}

function WorkspacePage({ locale, variant }: LocaleViewProps & { variant: WorkspaceVariant }) {
  const copy = getCopy(locale);
  const homeHref = `/${locale}/app`;
  const dashboardHref = `/${locale}/app/dashboard`;
  const heroTitle = variant === "home" ? copy.workspace.homeTitle : copy.workspace.dashboardTitle;
  const heroSubtitle = variant === "home" ? copy.workspace.homeSubtitle : copy.workspace.dashboardSubtitle;

  return (
    <div className="workspace-shell">
      <aside className="workspace-sidebar">
        <Link href={`/${locale}`} className="sidebar-brand">
          <span className="brand-mark">2</span>
          <span className="brand-copy">
            <strong>{copy.brandName}</strong>
            <small>{copy.brandTagline}</small>
          </span>
        </Link>

        <nav className="sidebar-nav" aria-label="workspace nav">
          <Link className={`sidebar-link ${variant === "home" ? "is-active" : ""}`} href={homeHref}>
            {copy.workspace.homeNavLabel}
          </Link>
          <Link className={`sidebar-link ${variant === "dashboard" ? "is-active" : ""}`} href={dashboardHref}>
            {copy.workspace.dashboardNavLabel}
          </Link>
          <Link className="sidebar-link" href={`${homeHref}#image-entry`}>
            {copy.workspace.imageNavLabel}
          </Link>
          <Link className="sidebar-link" href={`${homeHref}#paper-entry`}>
            {copy.workspace.paperNavLabel}
          </Link>
        </nav>

        <section className="sidebar-card">
          <h2>{copy.workspace.membershipTitle}</h2>
          <p>{copy.workspace.membershipBody}</p>
        </section>

        <section className="sidebar-card">
          <h2>{copy.workspace.quotaTitle}</h2>
          <p>{copy.workspace.quotaImage}</p>
          <p>{copy.workspace.quotaPaper}</p>
        </section>
      </aside>

      <div className="workspace-surface">
        <header className="workspace-topbar">
          <Link href={`/${locale}`} className="mobile-brand">
            <span className="brand-mark">2</span>
            <span className="brand-copy">
              <strong>{copy.brandName}</strong>
              <small>{copy.brandTagline}</small>
            </span>
          </Link>
          <div className="search-placeholder">{copy.workspace.searchPlaceholder}</div>
          <div className="topbar-actions">
            <span className="locale-chip">{copy.localeLabel}</span>
          </div>
        </header>

        <main className="workspace-main">
          <section className="welcome-card panel-card">
            <h1>{heroTitle}</h1>
            <p>{heroSubtitle}</p>
            <p className="market-note">{`${copy.marketLabel}: ${MARKET_PLACEHOLDER}`}</p>
          </section>

          <section className="hero-grid">
            <article id="image-entry" className="feature-card feature-card--violet">
              <h2>{copy.workspace.featureImage.title}</h2>
              <p>{copy.workspace.featureImage.description}</p>
              <Link className="feature-cta" href={homeHref}>
                {copy.workspace.featureImage.cta}
              </Link>
            </article>

            <article id="paper-entry" className="feature-card feature-card--blue">
              <h2>{copy.workspace.featurePaper.title}</h2>
              <p>{copy.workspace.featurePaper.description}</p>
              <Link className="feature-cta" href={dashboardHref}>
                {copy.workspace.featurePaper.cta}
              </Link>
            </article>

            <article className="snapshot-card panel-card">
              <h2>{copy.dashboard.snapshotTitle}</h2>
              <p>{copy.dashboard.snapshotBody}</p>
              <div className="metric-grid">
                {copy.dashboard.metrics.map((metric) => (
                  <section key={metric.label} className="metric-item">
                    <h3>{metric.label}</h3>
                    <p className="metric-value">{metric.value}</p>
                    <p className="metric-delta">{metric.delta}</p>
                  </section>
                ))}
              </div>
            </article>
          </section>

          <section className="quick-start panel-card">
            <h2>{copy.workspace.quickStartTitle}</h2>
            <ol className="quick-steps">
              {copy.workspace.quickSteps.map((step, index) => (
                <li key={step}>
                  <span className="step-index">{index + 1}</span>
                  <span className="step-label">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="content-grid">
            <article className="panel-card">
              <div className="section-head">
                <h2>{copy.workspace.recentTitle}</h2>
              </div>
              <div className="recent-list">
                {copy.workspace.recentItems.map((item) => (
                  <section key={item.title} className="recent-item">
                    <p className="recent-badge">{item.badge}</p>
                    <h3>{item.title}</h3>
                    <p>{item.meta}</p>
                  </section>
                ))}
              </div>
            </article>

            <article className="panel-card">
              <div className="section-head">
                <h2>{copy.workspace.templatesTitle}</h2>
              </div>
              <div className="template-list">
                {copy.workspace.templateItems.map((item) => (
                  <section key={item} className="template-item">
                    <h3>{item}</h3>
                  </section>
                ))}
              </div>
            </article>
          </section>

          <section className="member-strip panel-card">
            <h2>{copy.workspace.membershipTitle}</h2>
            <p>{copy.workspace.membershipBody}</p>
          </section>
        </main>

        <nav className="bottom-tabs" aria-label="mobile tabs">
          <Link className={`tab-link ${variant === "home" ? "is-active" : ""}`} href={homeHref}>
            {copy.workspace.homeNavLabel}
          </Link>
          <Link className="tab-link" href={`${homeHref}#image-entry`}>
            {copy.workspace.imageNavLabel}
          </Link>
          <Link className="tab-link" href={`${homeHref}#paper-entry`}>
            {copy.workspace.paperNavLabel}
          </Link>
          <Link className={`tab-link ${variant === "dashboard" ? "is-active" : ""}`} href={dashboardHref}>
            {copy.workspace.dashboardNavLabel}
          </Link>
          <Link className="tab-link" href={dashboardHref}>
            {copy.workspace.profileNavLabel}
          </Link>
        </nav>
      </div>
    </div>
  );
}
