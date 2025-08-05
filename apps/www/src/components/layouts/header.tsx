"use client";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronDownIcon,
  ChevronRightIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
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

  const menus: Menu[] = [
    { title: "Home", href: "#" },
    { title: "Projects", href: "#" },
    {
      title: "Hello",
      submenu: [
        { title: "Blogs", href: "#" },
        { title: "Gallerys", href: "#" },
        { title: "FAQs", href: "#" },
      ],
    },
    { title: "About", href: "#" },
    { title: "Contact", href: "#" },
    {
      title: "More",
      submenu: [
        { title: "Blog", href: "#" },
        { title: "Gallery", href: "#" },
        { title: "FAQ", href: "#" },
      ],
    },
    { title: "Contact Me", href: "#" },
  ];

  return (
    <div className="sticky top-0 px-2 py-2">
      {open && (
        <div
          className="fixed inset-0 z-[0]"
          onClick={() => setOpen(false)}
        ></div>
      )}
      <nav className="relative">
        <div className="flex justify-between rounded-full border bg-gray-100/80 px-4 py-2 shadow-lg before:absolute before:inset-0 before:z-[-1] before:backdrop-blur-sm dark:bg-gray-800/90">
          <Link href={"/"}>
            <span className="text-lg font-semibold">{t("header.title")}</span>
          </Link>

          <div className="hidden md:flex">
            <ul className="flex space-x-4">
              {menus.map((menu, index) => {
                if (menu.submenu && menu.submenu.length) {
                  return (
                    <div className="group" key={index}>
                      <button className="block cursor-pointer rounded px-2 py-1 transition duration-200 hover:underline">
                        {menu.title}{" "}
                        <ChevronDown className="inline-flex size-4" />
                      </button>
                      <div className="absolute hidden pt-2 group-hover:block">
                        <div className="bg-gray-100/80 p-4 shadow-lg backdrop-blur-sm dark:bg-gray-800/80">
                          <ul>
                            {menu.submenu.map((item, i) => (
                              <li key={i}>
                                <Link
                                  href={item.href ?? ""}
                                  className="block rounded px-2 py-1 transition duration-200 hover:underline"
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
                      className="block rounded px-2 py-1 transition duration-200 hover:underline"
                    >
                      {menu.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

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
        <ul
          className={cn(
            !open && "hidden md:block",
            "absolute left-0 mt-2 w-full rounded-lg border bg-gray-100/80 p-4 shadow-lg backdrop-blur-sm md:hidden md:hover:block dark:bg-gray-800/90",
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
  const [open, setOpen] = useState(false);
  return (
    <ul className="mt-2 space-y-1">
      {submenu.map((item, index) => (
        <li key={index}>
          <Link
            href={item.href ?? ""}
            className="block rounded px-2 py-1 transition duration-200 hover:underline"
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
