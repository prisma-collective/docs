'use client'

import { usePathname } from 'next/navigation'
import { Layout } from 'nextra-theme-docs'
import { ReactNode, ReactElement, JSXElementConstructor, useMemo } from 'react'

interface LocaleAwareLayoutProps {
  children: ReactNode
  navbar: ReactElement<Record<string, unknown>, string | JSXElementConstructor<any>>
  footer: ReactElement<Record<string, unknown>, string | JSXElementConstructor<any>>
  fullPageMap: any[]
  docsRepositoryBase: string
}

export function LocaleAwareLayout({
  children,
  navbar,
  footer,
  fullPageMap,
  docsRepositoryBase
}: LocaleAwareLayoutProps) {
  const pathname = usePathname()

  // Extract locale from pathname
  const locale = useMemo(() => {
    const segments = pathname?.split('/').filter(Boolean) || []
    return segments[0] || 'en'
  }, [pathname])

  // Filter page map by locale
  const pageMap = useMemo(() => {
    // Safety check: ensure fullPageMap is valid
    if (!fullPageMap || !Array.isArray(fullPageMap) || fullPageMap.length === 0) {
      // Return minimal valid structure instead of empty array
      return [{
        kind: 'MdxPage',
        name: 'index',
        route: `/${locale}`,
        frontMatter: {}
      }]
    }

    const localeFolder = fullPageMap.find((page: any) => page && page.route === `/${locale}`)

    if (!localeFolder || !localeFolder.children) {
      // Return minimal valid structure instead of empty array
      return [{
        kind: 'MdxPage',
        name: 'index',
        route: `/${locale}`,
        frontMatter: {}
      }]
    }

    return localeFolder.children
  }, [fullPageMap, locale])

  return (
    <Layout
      navbar={navbar}
      pageMap={pageMap}
      docsRepositoryBase={docsRepositoryBase}
      footer={footer}
      sidebar={{ autoCollapse: true, defaultMenuCollapseLevel: 1 }}
      editLink={null}
      nextThemes={{ defaultTheme: "dark" }}
    >
      {children}
    </Layout>
  )
}
