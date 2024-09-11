// utils.js
export const getAssetUrl = (path) => {
	const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
	return `${basePath}${path}`;
  };