import { defineStore } from 'pinia'
import type { Database } from '~/types/database.types'

interface Channel {
	id: string
	name: string
	youtube_id: string
	categories: string[]
	avatar_url?: string
	description?: string
	created_at?: string
}

export const useChannelsStore = defineStore('channels', {
	state: () => ({
		channels: [] as Channel[],
		loading: false,
		error: null as string | null,
		selectedCategories: [] as string[],
	}),

	getters: {
		getAllChannels: (state) => state.channels,

		getChannelById: (state) => (id: string) => {
			return state.channels.find((channel) => channel.id === id)
		},

		getChannelByYoutubeId: (state) => (youtubeId: string) => {
			return state.channels.find(
				(channel) => channel.youtube_id === youtubeId,
			)
		},

		getCategories: (state) => {
			const categories = new Set<string>()
			state.channels.forEach((channel) => {
				channel.categories.forEach((category) => {
					categories.add(category)
				})
			})
			return Array.from(categories)
		},

		getFilteredChannels: (state) => {
			if (state.selectedCategories.length === 0) {
				return state.channels
			}

			return state.channels.filter((channel) => {
				return state.selectedCategories.some((category) =>
					channel.categories.includes(category),
				)
			})
		},
	},

	actions: {
		async fetchChannels() {
			this.loading = true
			this.error = null

			try {
				const supabase = useSupabaseClient<Database>()
				const { data, error } = await supabase
					.from('channels')
					.select('*')
					.order('name')

				if (error) {
					throw error
				}

				this.channels = data || []
			} catch (err) {
				this.error =
					err instanceof Error
						? err.message
						: 'Failed to fetch channels'
				console.error('Error fetching channels:', err)
			} finally {
				this.loading = false
			}
		},

		setSelectedCategories(categories: string[]) {
			this.selectedCategories = categories
		},

		toggleCategory(category: string) {
			const index = this.selectedCategories.indexOf(category)
			if (index === -1) {
				this.selectedCategories.push(category)
			} else {
				this.selectedCategories.splice(index, 1)
			}
		},

		async updateChannel(
			channelId: string,
			updates: Partial<Omit<Channel, 'id' | 'created_at'>>,
		) {
			try {
				const supabase = useSupabaseClient<Database>()
				const { error } = await supabase
					.from('channels')
					.update(updates)
					.eq('id', channelId)

				if (error) {
					throw error
				}

				// Update local state
				const channelIndex = this.channels.findIndex(
					(c) => c.id === channelId,
				)
				if (channelIndex !== -1) {
					this.channels[channelIndex] = {
						...this.channels[channelIndex],
						...updates,
					}
				}

				return true
			} catch (err) {
				console.error('Error updating channel:', err)
				return false
			}
		},
	},
})
