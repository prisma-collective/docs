import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '@/mdx-components.js'
import { isValidLocale, DEFAULT_LOCALE } from '@/app/utils/i18n'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

const Wrapper = getMDXComponents().wrapper

/**
 * Extract locale from mdxPath
 * Handles both /en/path and /path (default) formats
 */
function extractLocaleFromPath(mdxPath) {
  // Normalize mdxPath to always be an array
  const pathArray = Array.isArray(mdxPath) ? mdxPath : []

  if (pathArray.length === 0) {
    return { locale: DEFAULT_LOCALE, contentPath: [] }
  }

  const firstSegment = String(pathArray[0]).toLowerCase()

  if (isValidLocale(firstSegment)) {
    return {
      locale: firstSegment,
      contentPath: pathArray.slice(1)
    }
  }

  return { locale: DEFAULT_LOCALE, contentPath: pathArray }
}

export default async function Page(props) {
  const params = await props.params
  const { locale, contentPath } = extractLocaleFromPath(params.mdxPath)

  // Build the path: [locale, ...contentPath]
  const fullPath = [locale, ...contentPath]

  // Filter and convert all to strings to avoid function calls
  const sanitizedPath = fullPath
    .filter((segment) => segment !== undefined && segment !== null && segment !== '')
    .map((segment) => String(segment))

  const result = await importPage(sanitizedPath)
  const { default: MDXContent, toc, metadata } = result

  return (
    <Wrapper toc={toc} metadata={metadata}>
      <div className="w-full">
        <div className="max-w-[850px] w-full mx-auto">
          <MDXContent {...props} params={{ ...params, locale }} />
        </div>
      </div>
    </Wrapper>
  )
}
