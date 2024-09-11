// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
	i18n: {
	  locales: ['en', 'es'], // Add your supported locales here
	  defaultLocale: 'en',
	},
	pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
	basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
	assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
	trailingSlash: true,
	output: 'export', // Add this line to enable static export
  };
  
  export default nextConfig;