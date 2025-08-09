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
          en: `${baseUrl}/en${pages.path}`,
          id: `${baseUrl}/id${pages.path}`,
          jv: `${baseUrl}/jv${pages.path}`,
          es: `${baseUrl}/es${pages.path}`,
          fr: `${baseUrl}/fr${pages.path}`,
          de: `${baseUrl}/de${pages.path}`,
          pt: `${baseUrl}/pt${pages.path}`,
          ru: `${baseUrl}/ru${pages.path}`,
          ja: `${baseUrl}/ja${pages.path}`,
          ko: `${baseUrl}/ko${pages.path}`,
          zh: `${baseUrl}/zh${pages.path}`,
          ar: `${baseUrl}/ar${pages.path}`,
          hi: `${baseUrl}/hi${pages.path}`,
        },
      },
    })),
  ];
}
