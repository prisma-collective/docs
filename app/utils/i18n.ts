/**
 * i18n Configuration and Utilities
 * Handles locale detection, validation, and defaults for Nextra
 */

export const AVAILABLE_LOCALES = ['en', 'es', 'pt'] as const
export const DEFAULT_LOCALE = 'en'

export type Locale = (typeof AVAILABLE_LOCALES)[number]

/**
 * Validates if a given string is a supported locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return AVAILABLE_LOCALES.includes(locale as Locale)
}

/**
 * Gets the default locale
 */
export function getDefaultLocale(): Locale {
  return DEFAULT_LOCALE
}

/**
 * Extracts locale from URL path segments
 * Handles both prefixed and unprefixed routes
 */
export function extractLocaleFromPath(pathSegments: string[]): Locale {
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
 * Constructs the content path for a given locale and mdx path
 * Handles both locale-prefixed and default routes
 */
export function getContentPath(locale: Locale, mdxPath: string[]): string[] {
  // For MDX files, we need to construct: content/[locale]/[...path]
  return [locale, ...mdxPath]
}

/**
 * Gets the locale display name
 */
export function getLocaleName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: 'English',
    es: 'Español',
    pt: 'Português'
  }
  return names[locale]
}

/**
 * Gets the HTML lang attribute for a locale
 */
export function getLangAttribute(locale: Locale): string {
  const langMap: Record<Locale, string> = {
    en: 'en',
    es: 'es',
    pt: 'pt'
  }
  return langMap[locale]
}
