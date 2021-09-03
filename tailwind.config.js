module.exports = {
	mode: 'jit',
	purge: {
		content: [
			'./src/*.{js,jsx,ts,tsx}',
			'./src/**/*.{js,jsx,ts,tsx}',
			'./src/**/**/*.{js,jsx,ts,tsx}',
			'./public/index.html',
		],
		safelist: ['w-9 h-9 w-12 h-12'],
	},
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {},
	},
	plugins: [require('@tailwindcss/forms')],
};
