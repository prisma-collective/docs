import nextra from 'nextra'

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false,
  },
})

export default withNextra({
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/processes/ground-potentialising/deploy',
        destination: '/events/nairobi',
        permanent: false, // Set to false for temporary redirect (302)
      },
    ]
  },
})
