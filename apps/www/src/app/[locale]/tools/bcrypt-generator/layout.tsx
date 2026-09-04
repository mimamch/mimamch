import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bcrypt_generator" });
  return { title: t("title"), description: t("description") };
}

export default function BcryptGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
