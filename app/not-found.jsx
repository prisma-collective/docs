import { NotFoundPage } from 'nextra-theme-docs'
import { useMDXComponents as getMDXComponents } from '@/mdx-components.js'

const Wrapper = getMDXComponents().wrapper

export default function NotFound() {
  return (
    <Wrapper toc={[]} metadata={{ title: 'Page not found', searchable: false }}>
      <NotFoundPage
        content="Submit an issue"
        labels="broken-link"
        className="x:min-h-0 x:h-auto x:py-12 x:max-w-2xl x:text-center"
      >
        <h1>The page is not found, which means it's either coming soon or has moved. This is common on a living document with multiple authors. Try using the search bar or try again soon.</h1>
      </NotFoundPage>
    </Wrapper>
  )
}