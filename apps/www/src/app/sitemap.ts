import type { MetadataRoute } from "next";

const buildDate = new Date("2025-08-08");

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mimamch.my.id";
  const pages = [
    { lastModified: buildDate, path: "/" },
    {
      lastModified: new Date(buildDate),
      path: "/tools/bcrypt-generator",
    },
  ];

  return [
    ...pages.map((pages) => ({
      url: `${baseUrl}${pages.path}`,
      lastModified: new Date(buildDate),
      alternates: {
        languages: {
          id: `${baseUrl}/id${pages.path}`,
        },
      },
    })),
  ];
}
