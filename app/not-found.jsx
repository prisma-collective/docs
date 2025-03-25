import { NotFoundPage } from 'nextra-theme-docs'
 
export default function NotFound() {
  return (
    <NotFoundPage content="Submit an issue" labels="broken-link">
      <h1>The page is not found, which means it's either coming soon or has moved. This is common on a living document with multiple authors. Try using the search bar or try again soon.</h1>
    </NotFoundPage>
  )
}