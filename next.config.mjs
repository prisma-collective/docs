import nextra from 'nextra'
import withMDX from '@next/mdx'

const withNextra = nextra({
  latex: true,
  search: {
    codeblocks: false
  }
})

const withMDXConfig = withMDX({
  extension: /\.mdx$/,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
})

export default withNextra({
  ...withMDXConfig,
  reactStrictMode: true,
})


