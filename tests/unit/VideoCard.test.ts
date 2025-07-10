import { mountSuspended } from '@nuxt/test-utils/runtime'
import VideoCard from '@/components/VideoCard.vue'

describe('VideoCard', () => {
	const defaultProps = {
		id: 'dQw4w9WgXcQ',
		title: 'Test Video Title',
		genre: ['Hip Hop', 'Alternative'],
		coArtists: ['Artist One', 'Artist Two'],
	}

	it('renders with required props', async () => {
		const wrapper = await mountSuspended(VideoCard, {
			props: defaultProps,
		})

		// Test content is correctly displayed from props
		expect(wrapper.text()).toContain('Test Video Title')
		expect(wrapper.find('img').attributes('alt')).toBe('Test Video Title')
	})

	it('displays correct YouTube thumbnail URL', async () => {
		const wrapper = await mountSuspended(VideoCard, {
			props: defaultProps,
		})

		const img = wrapper.find('img')
		expect(img.exists()).toBe(true)
		expect(img.attributes('src')).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg')
	})

	it('shows play button by default and hides video iframe', async () => {
		const wrapper = await mountSuspended(VideoCard, {
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
		const wrapper = await mountSuspended(VideoCard, {
			props: defaultProps,
		})

		// Click the play button
		const playButton = wrapper.find('button')
		await playButton.trigger('click')

		// iframe should now be present
		const iframe = wrapper.find('iframe')
		expect(iframe.exists()).toBe(true)
		expect(iframe.attributes('src')).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1')

		// Play button should be hidden
		expect(playButton.isVisible()).toBe(false)
	})

	it('displays genre tags correctly', async () => {
		const wrapper = await mountSuspended(VideoCard, {
			props: defaultProps,
		})

		const genreTags = wrapper.findAll('.bg-blue-100')
		expect(genreTags).toHaveLength(2)
		expect(genreTags[0].text()).toBe('Hip Hop')
		expect(genreTags[1].text()).toBe('Alternative')
	})

	it('displays co-artist tags correctly', async () => {
		const wrapper = await mountSuspended(VideoCard, {
			props: defaultProps,
		})

		const artistTags = wrapper.findAll('.bg-purple-100')
		expect(artistTags).toHaveLength(2)
		expect(artistTags[0].text()).toBe('Artist One')
		expect(artistTags[1].text()).toBe('Artist Two')
	})

	it('handles missing optional props gracefully', async () => {
		const wrapper = await mountSuspended(VideoCard, {
			props: {
				id: 'test-id',
				title: 'Test Title',
			},
		})

		// Should render without errors
		expect(wrapper.text()).toContain('Test Title')

		// No genre or artist tags should be present
		expect(wrapper.findAll('.bg-blue-100')).toHaveLength(0)
		expect(wrapper.findAll('.bg-purple-100')).toHaveLength(0)
	})

	it('handles empty arrays for optional props', async () => {
		const wrapper = await mountSuspended(VideoCard, {
			props: {
				id: 'test-id',
				title: 'Test Title',
				genre: [],
				coArtists: [],
			},
		})

		// Should render without errors
		expect(wrapper.text()).toContain('Test Title')

		// No genre or artist tags should be present
		expect(wrapper.findAll('.bg-blue-100')).toHaveLength(0)
		expect(wrapper.findAll('.bg-purple-100')).toHaveLength(0)
	})

	it('handles null coArtists prop correctly', async () => {
		const wrapper = await mountSuspended(VideoCard, {
			props: {
				id: 'test-id',
				title: 'Test Title',
				genre: ['Rock'],
				coArtists: null,
			},
		})

		// Should render genre tags but no artist tags
		expect(wrapper.findAll('.bg-blue-100')).toHaveLength(1)
		expect(wrapper.findAll('.bg-purple-100')).toHaveLength(0)
	})
})