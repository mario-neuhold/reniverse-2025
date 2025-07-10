import { mountSuspended } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'
import ImportPlaylist from '@/components/ImportPlaylist.vue'
import { useSongsStore } from '@/stores/songs'
import { useReactionsStore } from '@/stores/reactions'

// Mock the fetch function
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)
global.fetch = mockFetch

// Mock the useFetch composable
vi.mock('#app/composables', () => ({
	useFetch: vi.fn(),
}))

describe('ImportPlaylist', () => {
	beforeEach(() => {
		// Set up Pinia store for each test
		setActivePinia(createPinia())
		
		// Reset mocks
		vi.clearAllMocks()
	})

	it('renders the import form correctly', async () => {
		const wrapper = await mountSuspended(ImportPlaylist)

		// Test form elements are present
		expect(wrapper.text()).toContain('Import from YouTube Playlist')
		expect(wrapper.find('input[placeholder="Enter playlist URL or ID"]').exists()).toBe(true)
		expect(wrapper.find('button').text()).toContain('Import Playlist')
	})

	it('correctly extracts playlist ID from YouTube URL', async () => {
		const wrapper = await mountSuspended(ImportPlaylist)
		const vm = wrapper.vm as any

		// Test various URL formats
		const testCases = [
			{
				input: 'https://www.youtube.com/playlist?list=PLl234567890abcdef123456789012345678',
				expected: 'PLl234567890abcdef123456789012345678',
			},
			{
				input: 'https://youtube.com/watch?v=abc123&list=PLl234567890abcdef123456789012345678&index=1',
				expected: 'PLl234567890abcdef123456789012345678',
			},
			{
				input: 'PLl234567890abcdef123456789012345678',
				expected: 'PLl234567890abcdef123456789012345678',
			},
		]

		testCases.forEach(({ input, expected }) => {
			expect(vm.extractPlaylistId(input)).toBe(expected)
		})
	})

	it('returns null for invalid playlist ID formats', async () => {
		const wrapper = await mountSuspended(ImportPlaylist)
		const vm = wrapper.vm as any

		const invalidInputs = [
			'invalid-id',
			'https://youtube.com/watch?v=abc123',
			'',
			'not-a-playlist-id',
		]

		invalidInputs.forEach(input => {
			expect(vm.extractPlaylistId(input)).toBeNull()
		})
	})

	it('displays loading state when importing', async () => {
		const mockUseFetch = vi.mocked(useFetch)
		
		// Mock useFetch to return a promise that doesn't resolve immediately
		mockUseFetch.mockReturnValue({
			data: ref(null),
			pending: ref(true),
			error: ref(null),
		} as any)

		const wrapper = await mountSuspended(ImportPlaylist)

		// Set the input value
		const input = wrapper.find('input')
		await input.setValue('PLl234567890abcdef123456789012345678')

		// Mock the form submission
		const form = wrapper.find('form')
		await form.trigger('submit.prevent')

		// Should show loading state
		expect(wrapper.find('button').text()).toContain('Importing...')
		expect(wrapper.find('button').attributes('disabled')).toBeDefined()
	})

	it('displays error message when playlist ID is invalid', async () => {
		const wrapper = await mountSuspended(ImportPlaylist)

		// Set invalid input
		const input = wrapper.find('input')
		await input.setValue('invalid-playlist')

		// Submit the form
		const form = wrapper.find('form')
		await form.trigger('submit.prevent')

		// Should display error message
		expect(wrapper.text()).toContain('Invalid playlist URL or ID')
		expect(wrapper.find('.bg-red-50').exists()).toBe(true)
	})

	it('displays success message after successful import', async () => {
		const mockUseFetch = vi.mocked(useFetch)
		const songsStore = useSongsStore()
		const reactionsStore = useReactionsStore()

		// Mock successful API response
		mockUseFetch.mockReturnValue({
			data: ref({
				songs: [{ id: 'song1', title: 'Test Song' }],
				reactions: [{ id: 'reaction1', title: 'Test Reaction' }],
			}),
			pending: ref(false),
			error: ref(null),
		} as any)

		// Mock store methods
		vi.spyOn(songsStore, 'importVideos').mockResolvedValue(1)
		vi.spyOn(reactionsStore, 'importVideos').mockResolvedValue(1)

		const wrapper = await mountSuspended(ImportPlaylist)

		// Set valid input
		const input = wrapper.find('input')
		await input.setValue('PLl234567890abcdef123456789012345678')

		// Submit the form
		const form = wrapper.find('form')
		await form.trigger('submit.prevent')

		// Wait for async operations
		await wrapper.vm.$nextTick()

		// Should display success message
		expect(wrapper.text()).toContain('Successfully imported:')
		expect(wrapper.text()).toContain('1 songs')
		expect(wrapper.text()).toContain('1 reactions')
		expect(wrapper.find('.bg-green-50').exists()).toBe(true)
	})

	it('displays error message when API call fails', async () => {
		const mockUseFetch = vi.mocked(useFetch)

		// Mock failed API response
		mockUseFetch.mockReturnValue({
			data: ref(null),
			pending: ref(false),
			error: ref(null),
		} as any)

		const wrapper = await mountSuspended(ImportPlaylist)

		// Set valid input
		const input = wrapper.find('input')
		await input.setValue('PLl234567890abcdef123456789012345678')

		// Submit the form
		const form = wrapper.find('form')
		await form.trigger('submit.prevent')

		// Wait for async operations
		await wrapper.vm.$nextTick()

		// Should display error message
		expect(wrapper.text()).toContain('Failed to fetch playlist data')
		expect(wrapper.find('.bg-red-50').exists()).toBe(true)
	})

	it('clears input after successful import', async () => {
		const mockUseFetch = vi.mocked(useFetch)
		const songsStore = useSongsStore()
		const reactionsStore = useReactionsStore()

		// Mock successful API response
		mockUseFetch.mockReturnValue({
			data: ref({
				songs: [],
				reactions: [],
			}),
			pending: ref(false),
			error: ref(null),
		} as any)

		// Mock store methods
		vi.spyOn(songsStore, 'importVideos').mockResolvedValue(0)
		vi.spyOn(reactionsStore, 'importVideos').mockResolvedValue(0)

		const wrapper = await mountSuspended(ImportPlaylist)

		// Set valid input
		const input = wrapper.find('input')
		await input.setValue('PLl234567890abcdef123456789012345678')

		// Submit the form
		const form = wrapper.find('form')
		await form.trigger('submit.prevent')

		// Wait for async operations
		await wrapper.vm.$nextTick()

		// Input should be cleared
		expect(input.element.value).toBe('')
	})

	it('handles store import errors gracefully', async () => {
		const mockUseFetch = vi.mocked(useFetch)
		const songsStore = useSongsStore()

		// Mock successful API response
		mockUseFetch.mockReturnValue({
			data: ref({
				songs: [{ id: 'song1' }],
				reactions: [],
			}),
			pending: ref(false),
			error: ref(null),
		} as any)

		// Mock store method to throw error
		vi.spyOn(songsStore, 'importVideos').mockRejectedValue(new Error('Store error'))

		const wrapper = await mountSuspended(ImportPlaylist)

		// Set valid input
		const input = wrapper.find('input')
		await input.setValue('PLl234567890abcdef123456789012345678')

		// Submit the form
		const form = wrapper.find('form')
		await form.trigger('submit.prevent')

		// Wait for async operations
		await wrapper.vm.$nextTick()

		// Should display error message
		expect(wrapper.text()).toContain('Store error')
		expect(wrapper.find('.bg-red-50').exists()).toBe(true)
	})
})