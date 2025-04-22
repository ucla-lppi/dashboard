import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import mdx from '@next/mdx';
import remarkGfm from 'remark-gfm';

// Inline plugin to remove YAML front matter nodes from the AST
function removeYaml() {
  return (tree) => {
    tree.children = tree.children.filter(child => child.type !== 'yaml');
  };
}

const withMDX = mdx({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [remarkGfm, removeYaml],
  },
});

// Normalize BASE_PATH to always start with '/'
const rawBase = process.env.BASE_PATH || '';
const cleanedBase = rawBase.replace(/^\/+|\/+$/g, '');
const basePath = cleanedBase ? `/${cleanedBase}` : '';
const assetPrefix = process.env.ASSET_PREFIX || basePath;

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  basePath,
  assetPrefix,
  trailingSlash: true,
  output: 'export',
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.BASE_PATH || ''
  },
  webpack: (config, { isServer }) => {
    // Alias tailwindcss/version.js to tailwindcss/package.json
    config.resolve.alias['tailwindcss/version.js'] = require.resolve('tailwindcss/package.json');
    return config;
  },
};

export default withMDX(nextConfig);