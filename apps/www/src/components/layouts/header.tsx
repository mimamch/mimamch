"use client";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronDownIcon,
  ChevronRightIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type BaseMenu = {
  title: string | React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

type Menu = BaseMenu & {
  submenu?: BaseMenu[];
};

export default function Header() {
  const t = useTranslations("layouts");

  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onLocaleChange(locale: string) {
    const nextLocale = locale;
    window.location.replace(
      `/${nextLocale}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
    );
  }

  const menus: Menu[] = [
    { title: "Home", href: "#" },
    { title: "Projects", href: "#" },
    { title: "About", href: "#" },
    { title: "Contact Me", href: "#" },
    {
      title: t("header.language"),
      submenu: [
        {
          title: "English 🏴󠁧󠁢󠁥󠁮󠁧󠁿",
          onClick(e) {
            e.preventDefault();
            onLocaleChange("en");
          },
        },
        {
          title: "Indonesian 🇮🇩",
          onClick(e) {
            e.preventDefault();
            onLocaleChange("id");
          },
        },
      ],
    },
  ];

  return (
    <div className="container sticky top-0 z-[10] mx-auto px-2 py-2">
      {open && (
        <div
          className="fixed inset-0 z-[0]"
          onClick={() => setOpen(false)}
        ></div>
      )}
      <nav className="relative">
        <div className="flex justify-between rounded-full bg-gray-100/80 px-4 py-2 shadow-lg before:absolute before:inset-0 before:z-[-1] before:rounded-full before:backdrop-blur-sm dark:border-2 dark:bg-gray-900/80">
          <Link href={"/"}>
            <span className="text-lg font-semibold">{t("header.title")}</span>
          </Link>

          <div className="hidden md:flex">
            <ul className="flex space-x-4">
              {menus.map((menu, index) => {
                if (menu.submenu && menu.submenu.length) {
                  return (
                    <div className="group" key={index}>
                      <button className="block cursor-pointer text-nowrap rounded px-2 py-1 transition duration-200 hover:underline">
                        {menu.title}{" "}
                        <ChevronDown className="inline-flex size-4" />
                      </button>
                      <div className="absolute hidden pt-2 group-hover:block">
                        <div className="bg-gray-100/80 p-4 shadow-lg backdrop-blur-sm dark:bg-gray-900/80">
                          <ul>
                            {menu.submenu.map((item, i) => (
                              <li key={i}>
                                <Link
                                  href={item.href ?? ""}
                                  className="block text-nowrap rounded px-2 py-1 transition duration-200 hover:underline"
                                  onClick={item.onClick}
                                >
                                  {item.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <li key={index}>
                    <Link
                      href={menu.href ?? ""}
                      className="block text-nowrap rounded px-2 py-1 transition duration-200 hover:underline"
                      onClick={menu.onClick}
                    >
                      {menu.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <div className={cn("flex items-center")}>
              {open ? (
                <button onClick={() => setOpen(!open)}>
                  <XIcon />
                  <div className="sr-only">close menu</div>
                </button>
              ) : (
                <button onClick={() => setOpen(!open)}>
                  <MenuIcon />
                  <div className="sr-only">open menu</div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <ul
          className={cn(
            !open && "hidden md:block",
            "absolute left-0 z-10 mt-2 w-full rounded-lg border bg-gray-100/80 p-4 shadow-lg backdrop-blur-sm md:hidden md:hover:block dark:bg-gray-900/80",
          )}
        >
          {menus.map((menu, index) => (
            <li key={index}>
              <RenderMenu menu={menu} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function RenderMenu({ menu }: { menu: Menu }) {
  const [open, setOpen] = useState(false);
  if (!menu.submenu || !menu.submenu.length) {
    return (
      <Link
        href={menu.href ?? ""}
        className="flex rounded px-2 py-1 transition duration-200 hover:underline"
        onClick={menu.onClick}
      >
        {menu.title}
      </Link>
    );
  }

  return (
    <div className="px-2 py-1">
      <button
        className="flex cursor-pointer items-center hover:underline"
        onClick={() => setOpen(!open)}
      >
        {menu.title}{" "}
        <div className="">
          {open ? (
            <ChevronDownIcon className="size-4" />
          ) : (
            <ChevronRightIcon className="size-4" />
          )}
        </div>
        <div className="sr-only">open submenu</div>
      </button>
      <div className={cn(!open && "hidden")}>
        {<RenderSubMenu submenu={menu.submenu} />}
      </div>
    </div>
  );
}

function RenderSubMenu({ submenu }: { submenu: BaseMenu[] }) {
  return (
    <ul className="mt-2 space-y-1">
      {submenu.map((item, index) => (
        <li key={index}>
          <Link
            href={item.href ?? ""}
            className="block rounded px-2 py-1 transition duration-200 hover:underline"
            onClick={item.onClick}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
