import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import '../styles.css'
import { ReactNode } from 'react'
import Image from 'next/image';
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: 'Prisma Docs',
  description: 'Documentation for Prisma',
  metadataBase: new URL('https://docs.prisma.events'),
  openGraph: {
    title: 'Prisma Docs',
    description: 'Documentation for Prisma',
    type: 'website'
  }
}

const banner = <Banner storageKey="some-key">Upcoming action-learning journey: Accra, Ghana @ May 19 2025</Banner>
const navbar = (
  <Navbar
    logo={
      <div>
        <Image src="/logo_colour_w_text.svg" width={140} height={60} alt="Prisma Logo (Light)" />
      </div>
    }
    // ... Your additional navbar options
  />
);
const footer = <Footer>Prisma © {new Date().getFullYear()}</Footer>

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
      // ... Your additional head options
      >
        {/* Your additional tags should be passed as `children` of `<Head>` element */}
      </Head>
      <body>
        <Layout
          banner={banner}
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/prisma-collective/docs"
          footer={footer}
          sidebar={{ autoCollapse: true, defaultMenuCollapseLevel: 1 }}
          editLink={null}
          nextThemes={{ defaultTheme: 'dark' }}
        >
          {children}
          <Analytics />
        </Layout>
      </body>
    </html>
  )
}