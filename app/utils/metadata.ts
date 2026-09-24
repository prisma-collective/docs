import { getPageMap } from "nextra/page-map";

interface PageMapItem {
  name: string;
  route: string;
  title: string;
  frontMatter: { description?: string };
  content?: string;
  children?: PageMapItem[];
}

const DOC_LOCALES = new Set(["en", "es", "pt"]);

const flattenPages = (pages: any[]): PageMapItem[] =>
  pages.reduce((acc, page) => {
    if (page.route) acc.push(page);
    if (page.children) acc.push(...flattenPages(page.children));
    return acc;
  }, [] as PageMapItem[]);

function displayTitleFromMdxPath(mdxPath: string[] | undefined): string {
  const parts = mdxPath?.filter(Boolean) ?? [];
  if (parts.length === 0) return "Prisma Docs";
  const first = parts[0];
  if (parts.length === 1 && DOC_LOCALES.has(first)) {
    return "Prisma Docs";
  }
  if (DOC_LOCALES.has(first)) {
    return parts.slice(1).join(" ") || "Prisma Docs";
  }
  return parts.join(" ") || "Prisma Docs";
}

export async function generateMetadata({ params }: { params: { mdxPath?: string[] } }) {
  const title = displayTitleFromMdxPath(params?.mdxPath);
  const pathSegs = params?.mdxPath?.filter(Boolean) ?? [];
  const urlPath = pathSegs.join("/");
  const url = `https://docs.prisma.events/${urlPath}`;
  const image = `https://docs.prisma.events/api/og?title=${encodeURIComponent(title)}`;

  const pageMap = await getPageMap();
  const flatPages = flattenPages(pageMap);
  const route = pathSegs.length ? `/${pathSegs.join("/")}` : "";
  const currentPage = flatPages.find((page) => page.route === route);

  let description = "Read more in the Prisma documentation.";
  if (currentPage?.frontMatter?.description) {
    description = currentPage.frontMatter.description;
  } else if (currentPage?.content) {
    description =
      currentPage.content
        .replace(/[#_*`[\]]/g, "")
        .split("\n")
        .filter(Boolean)
        .slice(0, 2)
        .join(" ")
        .slice(0, 150) + "...";
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Prisma Docs",
      images: [{ url: image }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
