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
  docsRepositoryBase,
}: LocaleAwareLayoutProps) {
  const pathname = usePathname()

  const locale = useMemo(() => {
    const segments = pathname?.split('/').filter(Boolean) || []
    const first = segments[0] || 'en'
    const known = ['en', 'es', 'pt'] as const
    return (known as readonly string[]).includes(first) ? first : 'en'
  }, [pathname])

  const pageMap = useMemo(() => {
    const folder = fullPageMap.find(
      (page: any) =>
        page.route === `/${locale}` ||
        page.route === `/${locale}/` ||
        page.name === locale
    )
    const raw = folder?.children
    const list = Array.isArray(raw) ? raw.filter(Boolean) : []
    // nextra-theme-docs `normalizePages` requires a non-empty list (`list[0]` is read).
    if (list.length > 0) return list
    const enFolder = fullPageMap.find(
      (page: any) => page.route === '/en' || page.route === '/en/' || page.name === 'en'
    )
    const enList = Array.isArray(enFolder?.children) ? enFolder!.children.filter(Boolean) : []
    if (enList.length > 0) return enList
    return fullPageMap.filter(Boolean)
  }, [fullPageMap, locale])

  return (
    <Layout
      navbar={navbar}
      pageMap={pageMap}
      docsRepositoryBase={docsRepositoryBase}
      footer={footer}
      sidebar={{ autoCollapse: true, defaultMenuCollapseLevel: 1 }}
      editLink={null}
      nextThemes={{ defaultTheme: 'dark' }}
    >
      {children}
    </Layout>
  )
}
