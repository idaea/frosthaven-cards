/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.tsx"],
	theme: {
		extend: {},
	},
	plugins: [],
	safelist: [
		{
			pattern: /^[wh]-(5|6|7|8|9|10|11|12)$/,
			variants: ["lg", "md", "sm", "xl"],
		},
		{
			pattern: /^p-(1|0\.5)$/,
			variants: ["lg", "md", "sm", "xl"],
		},
	],
};
