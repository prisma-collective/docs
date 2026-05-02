import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import 'nextra-theme-docs/style.css';
import 'katex/dist/katex.min.css';
import '@/styles.css';
import { ReactNode } from 'react';
import Image from 'next/image';
import { Analytics } from "@vercel/analytics/react";
import { generateMetadata } from './utils/metadata';
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane, FaGithub } from "react-icons/fa";
import { BsCalendarWeek } from "react-icons/bs";
import { AuthProvider } from '@/contexts/AuthContext';
import NavbarWalletStatus from '@/components/NavbarWalletStatus';

const iconClasses = "w-5 h-5 text-gray-600 dark:text-gray-400 transition-all duration-300 hover:scale-110";
const hoverColorClasses = [
  'hover:text-prisma-a',
  'hover:text-prisma-b',
  'hover:text-prisma-c',
  'hover:text-prisma-d',
];

const getRandomHoverColor = () => hoverColorClasses[Math.floor(Math.random() * hoverColorClasses.length)];

const navbar = (
  <Navbar
    logo={
      <div className="inline-flex items-center gap-3">
        <Image src="/prisma-name-text-dark.svg" width={140} height={60} alt="Prisma Logo" />
      </div>
    }
    logoLink={"https://www.prisma.events/"}
    chatIcon={<FaTelegramPlane className={`${iconClasses} ${getRandomHoverColor()}`} />}
    chatLink={"https://t.me/+9-UF8k9H8dBjNWFk"}
    children={
      <div className="inline-flex items-center gap-4">
        <a href="https://twitter.com/__prismaevents" target="_blank" rel="noopener noreferrer">
          <FaXTwitter className={`${iconClasses} ${getRandomHoverColor()}`} />
        </a>
        <a href="https://lu.ma/prisma" target="_blank" rel="noopener noreferrer">
          <BsCalendarWeek className={`${iconClasses} ${getRandomHoverColor()}`} />
        </a>
        <NavbarWalletStatus />
      </div>
    }
    projectLink={"https://github.com/prisma-collective/"}
    projectIcon={<FaGithub className={`${iconClasses} ${getRandomHoverColor()}`} />}
  />
);

const footer = <Footer>Prisma © {new Date().getFullYear()}</Footer>

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ mdxPath?: string[] }>;
}) {
  const resolvedParams = await params;
  const metadata = await generateMetadata({ params: resolvedParams });

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter.images[0]} />
      </Head>
      <body>
        <AuthProvider>
          <Layout
            navbar={navbar}
            pageMap={await getPageMap()}
            docsRepositoryBase="https://github.com/prisma-collective/docs"
            footer={footer}
            sidebar={{ autoCollapse: true, defaultMenuCollapseLevel: 1 }}
            editLink={null}
            nextThemes={{ defaultTheme: "dark" }}
          >
            {children}
            <Analytics />
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
