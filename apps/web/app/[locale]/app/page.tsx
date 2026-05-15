import { notFound } from "next/navigation";
import { AppHomePage } from "@/components/app-ui";
import { isSupportedLocale } from "@/i18n/routing";

type AppHomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function AppHomeRoutePage({ params }: AppHomePageProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <AppHomePage locale={locale} />;
}
