// 一些网站配置

export type SiteConfig = {
  title: string;
  description: string;
  url: string;
  apiUrl: string;
};

export const siteConfig: SiteConfig = {
  title: "Klog",
  description:
    "Klog is a platform for creating and sharing your thoughts and ideas.",
  url: "https://example.com",
  apiUrl: "https://localhost:8010",
};
