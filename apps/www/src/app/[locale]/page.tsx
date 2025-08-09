import DotGrid from "@/components/backgrounds/dot-grid";
import Header from "@/components/layouts/header";
import { buttonVariants } from "@/components/ui/button";
import GradientText from "@/components/ui/gradient-text";
import PixelTransition from "@/components/ui/pixel-transition";
import RotatingText from "@/components/ui/rotating-text";
import { Link } from "@/i18n/navigation";
import { MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Home() {
  const t = useTranslations("home");
  return (
    <div>
      <main className="">
        <div className="relative h-dvh">
          <div className="absolute inset-0 bottom-0 top-0">
            <DotGrid
              dotSize={5}
              gap={15}
              baseColor="#191424"
              activeColor="#143cdb"
              proximity={100}
              shockRadius={250}
              shockStrength={5}
              resistance={750}
              returnDuration={1.5}
            />
          </div>

          <Header />

          <div className="container relative mx-auto flex h-[calc(100vh-6rem)] w-full items-center px-4">
            <div className="grid w-full grid-cols-12 items-center gap-y-10 md:gap-y-0">
              <div className="order-2 col-span-12 md:order-1 md:col-span-8">
                <p className="text-xl font-semibold md:text-2xl">
                  {t("my_name_is")},
                </p>
                <h1 className="text-3xl font-bold md:text-4xl">
                  <GradientText
                    colors={[
                      "#40ffaa",
                      "#4079ff",
                      "#40ffaa",
                      "#4079ff",
                      "#40ffaa",
                    ]}
                    animationSpeed={10}
                    showBorder={false}
                    className="w-fit text-start"
                  >
                    {t("my_name")}
                  </GradientText>
                </h1>
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-xl md:text-2xl">{t("i_am_a")}</p>
                  <RotatingText
                    texts={[
                      t("fullstack_developer"),
                      t("backend_developer"),
                      t("frontend_developer"),
                    ]}
                    className="justify-center overflow-hidden rounded-sm border-2 border-gray-600 bg-gray-800/50 px-4 py-0.5 text-xl backdrop-blur-sm md:text-2xl"
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={5000}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-4">
                  <Link
                    href={"mailto:mimamch28@gmail.com"}
                    className={buttonVariants({
                      variant: "outline",
                    })}
                  >
                    <MailIcon className="mr-1 inline" /> {t("send_me_email")}
                  </Link>
                  <Link
                    href={"https://www.linkedin.com/in/mimamch/"}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={buttonVariants({})}
                  >
                    <Image
                      src={"/linkedin.svg"}
                      alt="linkedin"
                      width={20}
                      height={20}
                      className="size-5"
                    />{" "}
                    {t("linkedin")}
                  </Link>
                  <Link
                    href={"https://github.com/mimamch"}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={buttonVariants({})}
                  >
                    <Image
                      src={"/github.svg"}
                      alt="github"
                      width={20}
                      height={20}
                      className="size-5"
                    />{" "}
                    {t("github")}
                  </Link>
                </div>
              </div>
              <div className="order-1 col-span-12 md:order-2 md:col-span-4">
                <PixelTransition
                  firstContent={
                    <Image
                      src="/mimamch.jpg"
                      alt="mimamch avatar"
                      width={500}
                      height={500}
                      priority
                    />
                  }
                  secondContent={
                    <div className="grid h-full w-full place-items-center bg-gray-900/80">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <Image
                          src="/linkedin.png"
                          alt="linkedin logo"
                          width={100}
                          height={100}
                          priority
                        />
                        <p className="font-bold">@mimamch</p>
                      </div>
                    </div>
                  }
                  gridSize={12}
                  pixelColor="#101828"
                  animationStepDuration={0.2}
                  className="mx-auto aspect-square w-3/4 rounded-full p-6 md:w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
