import Header from "@/components/layouts/header";
import BlurText from "@/components/ui/blur-text";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <div>
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800" />
      </div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <BlurText
          text="Muhammad Imam Choirudin"
          delay={150}
          animateBy="words"
          direction="top"
          className="mb-8 text-2xl"
        />
      </main>
    </div>
  );
}
