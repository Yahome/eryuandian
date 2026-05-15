type LocaleHomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleHomePage({ params }: LocaleHomePageProps) {
  const { locale } = await params;

  return (
    <main className="route-placeholder">
      <div className="route-placeholder__content">
        <p className="route-placeholder__eyebrow">/{locale}</p>
        <h1 className="route-placeholder__title">Web App route skeleton</h1>
        <p className="route-placeholder__body">
          This placeholder only verifies the localized home route. Market variant configuration is reserved separately from locale routing.
        </p>
      </div>
    </main>
  );
}
