import { mountSuspended } from '@nuxt/test-utils/runtime'
import ListItem from '@/components/ListItem.vue'

describe('ListItem', () => {
	it('renders with required text prop', async () => {
		const wrapper = await mountSuspended(ListItem, {
			props: {
				text: 'Test list item text',
			},
		})

		// Test content is correctly displayed from props
		expect(wrapper.text()).toBe('Test list item text')
		expect(wrapper.find('li').exists()).toBe(true)
	})

	it('updates content when text prop changes', async () => {
		const wrapper = await mountSuspended(ListItem, {
			props: {
				text: 'Initial text',
			},
		})

		// Check initial rendering
		expect(wrapper.text()).toBe('Initial text')

		// Update props
		await wrapper.setProps({
			text: 'Updated text content',
		})

		// Verify content updates with new props
		expect(wrapper.text()).toBe('Updated text content')
	})

	it('applies correct CSS classes for styling', async () => {
		const wrapper = await mountSuspended(ListItem, {
			props: {
				text: 'Test item',
			},
		})

		// Test that the correct element structure and classes are applied
		const listElement = wrapper.find('li')
		expect(listElement.exists()).toBe(true)
		expect(listElement.classes()).toContain('rounded-lg')
		expect(listElement.classes()).toContain('bg-white')
		expect(listElement.classes()).toContain('p-4')
		expect(listElement.classes()).toContain('text-center')
		expect(listElement.classes()).toContain('shadow-sm')
	})
})