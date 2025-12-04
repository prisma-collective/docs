import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import 'nextra-theme-docs/style.css';
import '@/styles.css';
import { ReactNode } from 'react';
import Image from 'next/image';
import { Analytics } from "@vercel/analytics/react";
import { generateMetadata } from './utils/metadata';
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane, FaGithub, FaWhatsapp } from "react-icons/fa";
import { BsCalendarWeek } from "react-icons/bs";
import { ActiveJourneyProvider } from '@/contexts/ActiveJourneyContext'

const iconClasses = "w-5 h-5 text-gray-600 dark:text-gray-400 transition-all duration-300 hover:scale-110"
const hoverColorClasses = [
  'hover:text-prisma-a',
  'hover:text-prisma-b',
  'hover:text-prisma-c',
  'hover:text-prisma-d',
];

type IconProps = React.SVGProps<SVGSVGElement>;

const getRandomHoverColor = () => hoverColorClasses[Math.floor(Math.random() * hoverColorClasses.length)];

const OpenCollectiveIcon = ({ style, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="currentColor"
    viewBox="0 0 16 16"
    style={style}
    {...props}
  >
    <path
      fillOpacity=".4"
      d="M12.995 8.195c0 .937-.312 1.912-.78 2.693l1.99 1.99c.976-1.327 1.6-2.966 1.6-4.683 0-1.795-.624-3.434-1.561-4.76l-2.068 2.028c.468.781.78 1.679.78 2.732z"
    />
    <path d="M8 13.151a4.995 4.995 0 1 1 0-9.99c1.015 0 1.951.273 2.732.82l1.95-2.03a7.805 7.805 0 1 0 .04 12.449l-1.951-2.03a5.07 5.07 0 0 1-2.732.781z" />
  </svg>
);

const navbar = (
  <Navbar
  className="bg-white dark:bg-gray-100 px-1 py-4 overflow-hidden"
    logo={
      <div >
        <Image src="/NexTrend_Logo.png" width={140} height={60} alt="Next Trend Logo" priority style={{ maxWidth: '100%', height: 'auto' }} />
      </div>
    }
    logoLink={"/"}
    chatIcon={<FaWhatsapp className={`${iconClasses} ${getRandomHoverColor()}`} />}
    chatLink={"https://chat.whatsapp.com/HmGN81m8Rte2lVAuOVfnUi"}
    children={
      <div className="inline-flex items-center gap-4">
        {/* X (Twitter) */}
        <a
          href="https://x.com/nextrendlabs/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaXTwitter className={`${iconClasses} ${getRandomHoverColor()}`} />
        </a>

        {/* Open Collective */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <OpenCollectiveIcon className={`${iconClasses} ${getRandomHoverColor()}`} />
        </a>

        {/* Calendar */}
        <a
          href="https://lu.ma/nextrendlabs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BsCalendarWeek className={`${iconClasses} ${getRandomHoverColor()}`} />
        </a>
      </div>
    }
    projectLink={"https://github.com/orgs/Next-Trend-Lab/repositories/"}
    projectIcon={<FaGithub className={`${iconClasses} ${getRandomHoverColor()}`} />}
  />
);

const footer = <Footer>Next Trend Group © {new Date().getFullYear()}</Footer>

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ mdxPath?: string[] }>;
}) {
  const resolvedParams = await params;
  const metadata = await generateMetadata({ params: resolvedParams }); // Generate dynamic metadata

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
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/Next-Trend-Lab/docs"
          footer={footer}
          sidebar={{ autoCollapse: true, defaultMenuCollapseLevel: 1 }}
          editLink={null}
          nextThemes={{ defaultTheme: "dark" }}
        >
          <ActiveJourneyProvider>
            {children}
          </ActiveJourneyProvider>
          <Analytics />
        </Layout>
      </body>
    </html>
  );
}
