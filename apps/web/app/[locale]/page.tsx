import { notFound } from "next/navigation";
import { LandingPage } from "@/components/app-ui";
import { isSupportedLocale } from "@/i18n/routing";

type LocaleHomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleHomePage({ params }: LocaleHomePageProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <LandingPage locale={locale} />;
}
