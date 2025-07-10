import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import ReactionCard from '@/components/ReactionCard.vue'
import { useChannelsStore } from '@/stores/channels'

describe('ReactionCard', () => {
	const defaultProps = {
		id: 'dQw4w9WgXcQ',
		title: 'Test Reaction Video',
		channelName: 'Test Channel',
		channelId: 'test-channel-id',
		categories: ['Review', 'First Listen'],
		songId: 'test-song-id',
	}

	beforeEach(() => {
		// Set up Pinia store for each test
		setActivePinia(createPinia())
	})

	it('renders with required props', async () => {
		const wrapper = await mountSuspended(ReactionCard, {
			props: defaultProps,
		})

		// Test content is correctly displayed from props
		expect(wrapper.text()).toContain('Test Reaction Video')
		expect(wrapper.text()).toContain('Test Channel')
		expect(wrapper.find('img').attributes('alt')).toBe('Test Reaction Video')
	})

	it('displays correct YouTube thumbnail URL', async () => {
		const wrapper = await mountSuspended(ReactionCard, {
			props: defaultProps,
		})

		const img = wrapper.find('img')
		expect(img.exists()).toBe(true)
		expect(img.attributes('src')).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg')
	})

	it('shows play button by default and hides video iframe', async () => {
		const wrapper = await mountSuspended(ReactionCard, {
			props: defaultProps,
		})

		// Play button should be visible
		const playButton = wrapper.find('button')
		expect(playButton.exists()).toBe(true)
		expect(playButton.isVisible()).toBe(true)

		// iframe should not be present initially
		const iframe = wrapper.find('iframe')
		expect(iframe.exists()).toBe(false)
	})

	it('shows iframe and hides play button when clicked', async () => {
		const wrapper = await mountSuspended(ReactionCard, {
			props: defaultProps,
		})

		// Click the play button
		const playButton = wrapper.find('button')
		await playButton.trigger('click')

		// iframe should now be present
		const iframe = wrapper.find('iframe')
		expect(iframe.exists()).toBe(true)
		expect(iframe.attributes('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1')

		// Play button should be hidden (but still in DOM with v-show)
		expect(playButton.element.style.display).toBe('none')
	})

	it('displays video categories correctly', async () => {
		const wrapper = await mountSuspended(ReactionCard, {
			props: defaultProps,
		})

		const categoryTags = wrapper.findAll('.bg-green-100')
		expect(categoryTags).toHaveLength(2)
		expect(categoryTags[0].text()).toBe('Review')
		expect(categoryTags[1].text()).toBe('First Listen')
	})

	it('displays channel name without link when no channelId', async () => {
		const wrapper = await mountSuspended(ReactionCard, {
			props: {
				...defaultProps,
				channelId: null,
			},
		})

		// Should display channel name as plain text
		expect(wrapper.text()).toContain('Test Channel')
		
		// Should not have a NuxtLink
		const channelLink = wrapper.find('a')
		expect(channelLink.exists()).toBe(false)
	})

	it('displays channel name with link when channelId is provided', async () => {
		const wrapper = await mountSuspended(ReactionCard, {
			props: defaultProps,
		})

		// Should display channel name as a link
		expect(wrapper.text()).toContain('Test Channel')
		
		// Should have a NuxtLink to the channel page
		const channelLink = wrapper.find('a')
		expect(channelLink.exists()).toBe(true)
		expect(channelLink.attributes('href')).toBe('/channels/test-channel-id')
	})

	it('displays channel categories when channel data is available in store', async () => {
		const channelsStore = useChannelsStore()
		
		// Mock channel data in the store
		channelsStore.channels = [{
			id: 'test-channel-id',
			name: 'Test Channel',
			youtube_id: 'test-youtube-id',
			categories: ['Reactor', 'Music Lover'],
			avatar_url: 'https://example.com/avatar.jpg',
		}]

		const wrapper = await mountSuspended(ReactionCard, {
			props: defaultProps,
		})

		// Should display channel categories
		const channelCategoryTags = wrapper.findAll('.bg-purple-100')
		expect(channelCategoryTags).toHaveLength(2)
		expect(channelCategoryTags[0].text()).toBe('Reactor')
		expect(channelCategoryTags[1].text()).toBe('Music Lover')
	})

	it('displays channel avatar when available in store', async () => {
		const channelsStore = useChannelsStore()
		
		// Mock channel data in the store with avatar
		channelsStore.channels = [{
			id: 'test-channel-id',
			name: 'Test Channel',
			youtube_id: 'test-youtube-id',
			categories: ['Reactor'],
			avatar_url: 'https://example.com/avatar.jpg',
		}]

		const wrapper = await mountSuspended(ReactionCard, {
			props: defaultProps,
		})

		// Should display channel avatar
		const avatarImg = wrapper.find('.h-5.w-5 img')
		expect(avatarImg.exists()).toBe(true)
		expect(avatarImg.attributes('src')).toBe('https://example.com/avatar.jpg')
		expect(avatarImg.attributes('alt')).toBe('Test Channel')
	})

	it('handles missing channel data in store gracefully', async () => {
		const wrapper = await mountSuspended(ReactionCard, {
			props: defaultProps,
		})

		// Should still render without errors
		expect(wrapper.text()).toContain('Test Reaction Video')
		expect(wrapper.text()).toContain('Test Channel')
		
		// Should not display channel categories when channel not found in store
		const channelCategoryTags = wrapper.findAll('.bg-purple-100')
		expect(channelCategoryTags).toHaveLength(0)
	})
})