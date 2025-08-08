import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { Geist_Mono, Lexend } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const fontSans = Lexend({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "mimamch | Muhammad Imam Choirudin",
    template: "%s | mimamch",
  },
  description: "Software Engineer, Open Source Enthusiast. Based in Indonesia.",
  openGraph: {
    title: "mimamch | Muhammad Imam Choirudin",
    description:
      "Software Engineer, Open Source Enthusiast. Based in Indonesia.",
    url: "https://mimamch.my.id",
    siteName: "mimamch | Muhammad Imam Choirudin",
    images: ["https://mimamch.my.id/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "mimamch | Muhammad Imam Choirudin",
    description:
      "Software Engineer, Open Source Enthusiast. Based in Indonesia.",
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
  abstract:
    "Muhammad Imam Choirudin is a Software Engineer and Open Source Enthusiast based in Indonesia. He specializes in Full Stack Development, with expertise in Next.js, React, and JavaScript.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          forcedTheme="dark"
        >
          <NextIntlClientProvider>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
