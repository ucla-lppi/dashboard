// next.config.mjs
import mdx from '@next/mdx';

const withMDX = mdx({
  extension: /\.(md|mdx)$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
  trailingSlash: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      // Add other pages here
    }
  },
};

export default withMDX(nextConfig);