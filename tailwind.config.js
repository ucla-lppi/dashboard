/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/plugin");
module.exports = {
    content: [
      './content/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/**/*.{js,ts,jsx,tsx,mdx}',
      "./node_modules/flowbite-react/**/*.js"
    ],
    theme: {
      extend: {
        colors: {
          background: "var(--background)",
          foreground: "var(--foreground)",
          primary: {
            DEFAULT: "#005587", // Primary color in hexadecimal
            // dark: "#005587",  // Dark variant of the primary color
          },
          brandColor: "#005587",
          secondary: "#338F87", // Used for the shadows
          tertiary: "#AEC8C3",  // Used for the footer
		  quaternary: "#338F87",
		  accents: "#1B3F60", // Used for buttons
        },
        fontFamily: {
          Lexend_Deca: ['var(--font-lexend-deca)', 'sans-serif'],
          Lexend_Zetta: ['"Lexend Zetta"', 'sans-serif'],
          laBelleAurore: ['"La Belle Aurore"', 'cursive'],
          lexendLite: ['"Lexend Lite"', 'sans-serif'],
          montserrat: ['Montserrat', 'sans-serif'],
        },
        typography: (theme) => ({
          DEFAULT: {
            css: {
              color: theme("colors.black.700"),
              a: {
                color: theme("colors.black.500"),
                "&:hover": {
                  color: theme("colors.black.700"),
                },
              },
              h1: { color: theme("colors.black.900") },
              h2: { color: theme("colors.black.900") },
              h3: { color: theme("colors.black.900") },
              h4: { color: theme("colors.black.900") },
              code: { color: theme("colors.pink.500") },
              "blockquote p:first-of-type::before": { content: "none" },
              "blockquote p:last-of-type::after": { content: "none" },
            },
          },
        }),
      },
      screens: {
        "max-h-620": { raw: "(max-height: 620px)" },
      },
    },
    plugins: [
      require("@tailwindcss/typography"),
      flowbite,
      // Custom plugin to output your theme colors as CSS variables
      function ({ addBase, theme }) {
        addBase({
          ":root": {
            "--primary-color": theme("colors.primary.DEFAULT"),
            "--secondary-color": theme("colors.secondary"),
            "--tertiary-color": theme("colors.tertiary"),
			"--quaternary-color": theme("colors.quaternary"),
            // full URL for selector rectangle, uses asset prefix
            "--selector-rectangle-url": `url('${process.env.NEXT_PUBLIC_ASSET_PREFIX || ''}/static/img/selector-rectangle.png')`,
          },
        });
      },
    ],
};