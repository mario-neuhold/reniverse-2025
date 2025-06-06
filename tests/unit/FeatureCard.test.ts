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

		expect(wrapper.find('h3').text()).toBe('Test Feature')
		expect(wrapper.find('p').text()).toBe('This is a test description')
		expect(wrapper.find('.i-heroicons-star').exists()).toBe(true)
	})

	it('applies correct CSS classes to container', async () => {
		const wrapper = await mountSuspended(FeatureCard, {
			props: {
				title: 'Test Feature',
				description: 'Test description',
				icon: 'i-heroicons-home',
			},
		})

		const container = wrapper.find('div')
		expect(container.classes()).toContain('rounded-xl')
		expect(container.classes()).toContain('bg-white')
		expect(container.classes()).toContain('p-6')
		expect(container.classes()).toContain('shadow-sm')
		expect(container.classes()).toContain('transition-shadow')
		expect(container.classes()).toContain('hover:shadow-md')
		expect(container.classes()).toContain('dark:bg-gray-800')
	})

	it('renders icon with correct classes', async () => {
		const wrapper = await mountSuspended(FeatureCard, {
			props: {
				title: 'Test Feature',
				description: 'Test description',
				icon: 'i-heroicons-cog',
			},
		})

		const iconContainer = wrapper.find('.text-primary-500')
		expect(iconContainer.exists()).toBe(true)
		expect(iconContainer.classes()).toContain('mb-4')
		expect(iconContainer.classes()).toContain('text-2xl')

		const iconElement = iconContainer.find('.i-heroicons-cog')
		expect(iconElement.exists()).toBe(true)
	})

	it('renders title with correct styling', async () => {
		const wrapper = await mountSuspended(FeatureCard, {
			props: {
				title: 'Amazing Feature',
				description: 'Test description',
				icon: 'i-heroicons-check',
			},
		})

		const title = wrapper.find('h3')
		expect(title.text()).toBe('Amazing Feature')
		expect(title.classes()).toContain('mb-2')
		expect(title.classes()).toContain('text-xl')
		expect(title.classes()).toContain('font-semibold')
		expect(title.classes()).toContain('text-gray-900')
		expect(title.classes()).toContain('dark:text-white')
	})

	it('renders description with correct styling', async () => {
		const wrapper = await mountSuspended(FeatureCard, {
			props: {
				title: 'Test Feature',
				description: 'This is a detailed description of the feature',
				icon: 'i-heroicons-heart',
			},
		})

		const description = wrapper.find('p')
		expect(description.text()).toBe(
			'This is a detailed description of the feature',
		)
		expect(description.classes()).toContain('text-gray-600')
		expect(description.classes()).toContain('dark:text-gray-300')
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

			expect(wrapper.find(`.${iconClass}`).exists()).toBe(true)
		}
	})
})
