'use client'

import { usePathname } from 'next/navigation'
import { AVAILABLE_LOCALES, getLocaleName, isValidLocale, DEFAULT_LOCALE } from '@/app/utils/i18n'
import type { Locale } from '@/app/utils/i18n'

/**
 * Language Selector Component
 * Allows users to switch between available locales
 * Stores preference in localStorage
 */
export function LanguageSelector() {
  const pathname = usePathname()

  /**
   * Extract current locale from pathname
   */
  const extractCurrentLocale = (): Locale => {
    const pathSegments = pathname.split('/').filter(Boolean)

    if (pathSegments.length === 0) {
      return DEFAULT_LOCALE
    }

    const firstSegment = pathSegments[0]?.toLowerCase()
    if (isValidLocale(firstSegment)) {
      return firstSegment
    }

    return DEFAULT_LOCALE
  }

  /**
   * Build URL for a given locale, preserving the rest of the path
   */
  const buildLocaleUrl = (targetLocale: Locale): string => {
    const pathSegments = pathname.split('/').filter(Boolean)
    let currentPath = ''

    // Extract current locale if present
    let contentPath = pathSegments
    const firstSegment = pathSegments[0]?.toLowerCase()

    if (isValidLocale(firstSegment)) {
      contentPath = pathSegments.slice(1)
    }

    // Build new URL
    if (targetLocale === DEFAULT_LOCALE) {
      // Default locale doesn't need prefix
      currentPath = contentPath.length > 0 ? '/' + contentPath.join('/') : '/'
    } else {
      // Non-default locales need prefix
      currentPath = '/' + targetLocale + (contentPath.length > 0 ? '/' + contentPath.join('/') : '')
    }

    return currentPath
  }

  const currentLocale = extractCurrentLocale()

  return (
    <div className="flex items-center gap-2">
      {AVAILABLE_LOCALES.map((locale) => (
        <a
          key={locale}
          href={buildLocaleUrl(locale)}
          className={`
            px-2 py-1 rounded text-sm transition-colors
            ${
              currentLocale === locale
                ? 'bg-gray-200 dark:bg-gray-700 font-semibold'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
          title={`Switch to ${getLocaleName(locale)}`}
        >
          {getLocaleName(locale)}
        </a>
      ))}
    </div>
  )
}
