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
	exportPathMap: async function (
	  defaultPathMap,
	  { dev, dir, outDir, distDir, buildId }
	) {
	  return {
		'/': { page: '/' },
		'/es': { page: '/', query: { locale: 'es' } },
	  }
	},
  };
  
  export default nextConfig;