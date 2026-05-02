import { getPageMap } from "nextra/page-map";

interface PageMapItem {
  name: string;
  route: string;
  title: string;
  frontMatter: { description?: string };
  content?: string;
  children?: PageMapItem[];
}

const flattenPages = (pages: any[]): PageMapItem[] =>
  pages.reduce((acc, page) => {
    if (page.route) acc.push(page);
    if (page.children) acc.push(...flattenPages(page.children));
    return acc;
  }, [] as PageMapItem[]);

export async function generateMetadata({ params }: { params: { mdxPath?: string[] } }) {
  const title = params?.mdxPath?.join(" ") || "Prisma Docs";
  const url = `https://docs.prisma.events/${params?.mdxPath?.join("/") || ""}`;
  const image = `https://docs.prisma.events/api/og?title=${encodeURIComponent(title)}`;

  const pageMap = await getPageMap();
  const flatPages = flattenPages(pageMap);
  const route = `/${params?.mdxPath?.join("/") || ""}`;
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
