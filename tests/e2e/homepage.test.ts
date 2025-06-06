import { test, expect } from '@playwright/test'

test('home page displays correctly', async ({ page }) => {
	await page.goto('/')

	// Check if the page title is correct
	await expect(page).toHaveTitle(/Reniverse/)

	// Check if main content is visible
	const main = page.locator('main')
	await expect(main).toBeVisible()
})

test('navigation works correctly', async ({ page }) => {
	await page.goto('/')

	// Test navigation to channels page if it exists
	const channelsLink = page.locator('a[href*="channels"]').first()

	if ((await channelsLink.count()) > 0) {
		await channelsLink.click()
		await expect(page).toHaveURL(/channels/)
	}
})

test('responsive design works', async ({ page }) => {
	await page.goto('/')

	// Test mobile viewport
	await page.setViewportSize({ width: 375, height: 667 })
	await expect(page.locator('body')).toBeVisible()

	// Test desktop viewport
	await page.setViewportSize({ width: 1200, height: 800 })
	await expect(page.locator('body')).toBeVisible()
})
