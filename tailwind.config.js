/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
	  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
	  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
	  extend: {
		colors: {
		  background: "var(--background)",
		  foreground: "var(--foreground)",
		  primary: {
			DEFAULT: "#003B5C", // Primary color in hexadecimal
			dark: "#003B5C",   // Dark variant of the primary color
		  },
		},
	  },
	},
	plugins: [],
  };