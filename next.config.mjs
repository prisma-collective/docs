import nextra from 'nextra'

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false,
  },
  defaultShowCopyCode: true,
})

export default withNextra({
  reactStrictMode: true,
  outputFileTracingExcludes: {
    // Match all app/page and API routes — `/api/*` misses nested paths like `/api/pages/snapshot`.
    '*': ['.git/**', '.git/objects/**', '.git/objects/pack/**'],
  },
  outputFileTracingIncludes: {
    '/api/pages/snapshot': ['./data/pages-snapshot.json'],
    '*': ['./data/protocols-snapshot.json'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/pitch',
        destination: '/en/context-narrative/decks/2026/1',
        permanent: false,
      },
    ]
  },
})
