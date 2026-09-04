import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { Locale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Geist_Mono, Lexend } from "next/font/google";
import { locale } from "next/root-params";
import { Toaster } from "react-hot-toast";
import "../globals.css";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

const fontSans = Lexend({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const SITE_NAME = "mimamch | Muhammad Imam Choirudin";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description = t("description");

  return {
    title: { default: SITE_NAME, template: "%s | mimamch" },
    description,
    openGraph: {
      title: SITE_NAME,
      description,
      url: "https://mimamch.my.id",
      siteName: SITE_NAME,
      images: ["https://mimamch.my.id/og-image.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description,
      images: ["https://mimamch.my.id/og-image.png"],
    },
    keywords: [
      "Muhammad Imam Choirudin",
      "mimamch",
      "Software Engineer",
      "Full Stack Developer",
      "Backend Developer",
      "Frontend Developer",
      "Open Source Enthusiast",
      "Indonesia",
      "Web Developer",
      "Next.js",
      "React",
      "JavaScript",
    ],
    abstract: t("abstract"),
  };
}

export default async function RootLayout({
  children,
  // params,
}: Readonly<{
  children: React.ReactNode;
  // params: Promise<{ locale: string }>;
}>) {
  const loc = await locale();

  return (
    <html lang={loc || "en"} suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          forcedTheme="dark"
        >
          <NextIntlClientProvider locale={loc as Locale}>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
