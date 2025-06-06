import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
	test: {
		environment: 'nuxt',
		environmentOptions: {
			nuxt: {
				domEnvironment: 'happy-dom',
				overrides: {
					// Disable Supabase in tests to avoid configuration issues
					modules: [],
					ssr: false,
				},
			},
		},
		globals: true,
		typecheck: {
			tsconfig: './tsconfig.json',
		},
		coverage: {
			provider: 'v8',
		},
		// Only run unit tests with vitest, exclude e2e tests
		include: [
			'tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
		],
	},
})
