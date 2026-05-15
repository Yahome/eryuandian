type AppHomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function AppHomePage({ params }: AppHomePageProps) {
  const { locale } = await params;

  return (
    <main className="route-placeholder">
      <div className="route-placeholder__content">
        <p className="route-placeholder__eyebrow">/{locale}/app</p>
        <h1 className="route-placeholder__title">App workspace placeholder</h1>
        <p className="route-placeholder__body">
          This page is the minimum workspace route for TWA-001A. It does not implement login, session, billing, generation, or full App Shell UI.
        </p>
      </div>
    </main>
  );
}
