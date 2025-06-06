// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: [
		'@nuxt/eslint',
		'@nuxt/test-utils/module',
		'@pinia/nuxt',
		'@nuxtjs/supabase',
		'@nuxt/ui-pro',
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
