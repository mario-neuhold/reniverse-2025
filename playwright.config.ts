import { defineConfig, devices } from '@playwright/test'
import type { ConfigOptions } from '@nuxt/test-utils/playwright'

export default defineConfig<ConfigOptions>({
	use: {
		// Configure Nuxt test utils
		nuxt: {
			// Set the port of the Nuxt instance to test against
			// port: 4000,
		},
		// Base URL to use in actions like `await page.goto('/')`
		baseURL: 'http://127.0.0.1:3000',
		// Collect trace when retrying the failed test
		trace: 'on-first-retry',
	},
	// Test directory
	testDir: './tests/e2e',
	// Run tests in files in parallel
	fullyParallel: true,
	// Fail the build on CI if you accidentally left test.only in the source code
	forbidOnly: !!process.env.CI,
	// Retry on CI only
	retries: process.env.CI ? 2 : 0,
	// Opt out of parallel tests on CI
	workers: process.env.CI ? 1 : undefined,
	// Reporter to use
	reporter: 'html',
	// Configure projects for major browsers
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
		},
	],
	// Run your local dev server before starting the tests
	webServer: {
		command: 'pnpm dev',
		url: 'http://127.0.0.1:3000',
		reuseExistingServer: !process.env.CI,
	},
})
