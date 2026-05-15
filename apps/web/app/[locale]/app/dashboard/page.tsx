type DashboardPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;

  return (
    <main className="route-placeholder">
      <div className="route-placeholder__content">
        <p className="route-placeholder__eyebrow">/{locale}/app/dashboard</p>
        <h1 className="route-placeholder__title">Dashboard placeholder</h1>
        <p className="route-placeholder__body">
          This is only the localized dashboard route skeleton. Real dashboard content and mobile App Shell work stay out of TWA-001A.
        </p>
      </div>
    </main>
  );
}
