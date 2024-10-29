// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
	basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
	assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
	trailingSlash: true,
	output: 'export', // Enable static export
  };
  
  export default nextConfig;