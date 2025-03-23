// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: [
		'@nuxt/eslint',
		'@nuxt/test-utils',
		'@pinia/nuxt',
		'@nuxtjs/supabase',
	],
	css: ['~/assets/css/main.css'],
	vite: {
		plugins: [tailwindcss()],
	},
	supabase: {
		redirectOptions: {
			login: '/login',
			callback: '/confirm',
			exclude: ['/*'],
		},
	},
})
