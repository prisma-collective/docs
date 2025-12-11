'use client'

import { usePathname } from 'next/navigation'
import { Layout } from 'nextra-theme-docs'
import { ReactNode, useMemo } from 'react'

interface LocaleAwareLayoutProps {
  children: ReactNode
  navbar: ReactNode
  footer: ReactNode
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
    const localeFolder = fullPageMap.find((page: any) => page.route === `/${locale}`)

    if (!localeFolder || !localeFolder.children) {
      return []
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
