// next.config.mjs
import mdx from '@next/mdx';
import remarkGfm from 'remark-gfm';

const withMDX = mdx({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [remarkGfm],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  basePath: process.env.BASE_PATH || '',
  assetPrefix: process.env.ASSET_PREFIX || '',
  trailingSlash: true,
  output: 'export',
};

export default withMDX(nextConfig);