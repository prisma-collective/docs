import nextra from 'nextra'

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false,
  },
  defaultShowCopyCode: true
})

export default withNextra({
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false,
      },
      {
        source: '/processes/process-infrastructuring/timeli',
        destination: '/en/processes/process-infrastructuring/timelining',
        permanent: false,
      },
      {
        source: '/processes/ground-potentialising/deplo',
        destination: '/en/processes/ground-potentialising/deploy',
        permanent: false,
      }
    ]
  },
})
