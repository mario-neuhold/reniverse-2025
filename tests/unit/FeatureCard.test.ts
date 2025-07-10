import { mountSuspended } from '@nuxt/test-utils/runtime'
import FeatureCard from '@/components/FeatureCard.vue'

describe('FeatureCard', () => {
	it('renders with required props', async () => {
		const wrapper = await mountSuspended(FeatureCard, {
			props: {
				title: 'Test Feature',
				description: 'This is a test description',
				icon: 'i-heroicons-star',
			},
		})

		// Test content is correctly displayed from props
		expect(wrapper.find('h3').text()).toBe('Test Feature')
		expect(wrapper.find('p').text()).toBe('This is a test description')
		expect(wrapper.find('.i-heroicons-star').exists()).toBe(true)
	})

	it('handles different icon classes correctly', async () => {
		const icons = [
			'i-heroicons-star',
			'i-heroicons-heart',
			'i-heroicons-home',
			'i-custom-icon',
		]

		for (const iconClass of icons) {
			const wrapper = await mountSuspended(FeatureCard, {
				props: {
					title: 'Test',
					description: 'Test',
					icon: iconClass,
				},
			})

			// Test that the dynamic icon class is applied correctly
			expect(wrapper.find(`.${iconClass}`).exists()).toBe(true)
		}
	})

	it('updates content when props change', async () => {
		const wrapper = await mountSuspended(FeatureCard, {
			props: {
				title: 'Initial Title',
				description: 'Initial Description',
				icon: 'i-heroicons-bell',
			},
		})

		// Check initial rendering
		expect(wrapper.find('h3').text()).toBe('Initial Title')
		expect(wrapper.find('p').text()).toBe('Initial Description')
		expect(wrapper.find('.i-heroicons-bell').exists()).toBe(true)

		// Update props
		await wrapper.setProps({
			title: 'Updated Title',
			description: 'Updated Description',
			icon: 'i-heroicons-flag',
		})

		// Verify content updates with new props
		expect(wrapper.find('h3').text()).toBe('Updated Title')
		expect(wrapper.find('p').text()).toBe('Updated Description')
		expect(wrapper.find('.i-heroicons-bell').exists()).toBe(false)
		expect(wrapper.find('.i-heroicons-flag').exists()).toBe(true)
	})
})
