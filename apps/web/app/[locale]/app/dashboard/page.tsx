import { notFound } from "next/navigation";
import { DashboardPage } from "@/components/app-ui";
import { isSupportedLocale } from "@/i18n/routing";

type DashboardPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function DashboardRoutePage({ params }: DashboardPageProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return <DashboardPage locale={locale} />;
}
