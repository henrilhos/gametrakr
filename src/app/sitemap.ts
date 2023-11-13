import { type MetadataRoute } from "next";

const addPathToBaseURL = (path: string) => `https://gametra.kr${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/"].map((route) => ({
    url: addPathToBaseURL(route),
    lastModified: new Date(),
  }));

  return [...routes];
}
