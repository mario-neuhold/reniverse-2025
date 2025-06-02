import { defineStore } from 'pinia'
import type { Database } from '~/types/database.types'

type Reaction = Database['public']['Tables']['reactions']['Row']

export const useReactionsStore = defineStore('reactions', {
	state: () => ({
		categories: [
			'Vocal Analysis',
			'Lyrics Breakdown',
			'Emotional Response',
			'Mental Health',
			'Musical Analysis',
			'First Time Reaction',
			'Producer Review',
		] as string[],
		reactions: [] as Reaction[],
		selectedSong: '',
		selectedCategories: [] as string[],
		selectedChannel: '',
		loading: false,
		error: null as string | null,
	}),
	getters: {
		getCategories: (state) => state.categories,
		getAllReactions: (state) => state.reactions,
		getFilteredReactions: (state) => {
			return state.reactions.filter((reaction) => {
				const matchesSong =
					!state.selectedSong ||
					reaction.song_id === state.selectedSong
				const matchesCategories =
					state.selectedCategories.length === 0 ||
					state.selectedCategories.some((cat) =>
						reaction.categories.includes(cat),
					)
				const matchesChannel =
					!state.selectedChannel ||
					reaction.channel_id === state.selectedChannel
				return matchesSong && matchesCategories && matchesChannel
			})
		},
		getReactionsBySong: (state) => (songId: string) =>
			state.reactions.filter((reaction) => reaction.song_id === songId),
		getReactionsByChannel: (state) => (channelId: string) =>
			state.reactions.filter(
				(reaction) => reaction.channel_id === channelId,
			),
		getReactionsByCategory: (state) => (category: string) =>
			state.reactions.filter((reaction) =>
				reaction.categories.includes(category),
			),
		getUniqueChannelNames: (state) => {
			const channelNames = new Set<string>()
			state.reactions.forEach((reaction) => {
				if (reaction.channel_name) {
					channelNames.add(reaction.channel_name)
				}
			})
			return Array.from(channelNames).sort()
		},
		getChannelStats: (state) => (channelId: string) => {
			const channelReactions = state.reactions.filter(
				(reaction) => reaction.channel_id === channelId,
			)

			const uniqueSongs = new Set<string>()
			const uniqueCategories = new Set<string>()

			channelReactions.forEach((reaction) => {
				uniqueSongs.add(reaction.song_id)
				reaction.categories.forEach((category) => {
					uniqueCategories.add(category)
				})
			})

			return {
				totalReactions: channelReactions.length,
				uniqueSongCount: uniqueSongs.size,
				uniqueCategoryCount: uniqueCategories.size,
				categories: Array.from(uniqueCategories),
			}
		},
	},
	actions: {
		async fetchReactions() {
			this.loading = true
			this.error = null
			try {
				const supabase = useSupabaseClient<Database>()
				const { data, error } = await supabase
					.from('reactions')
					.select('*')
					.order('created_at', { ascending: true })

				if (error) throw error
				this.reactions = data
			} catch (e) {
				this.error = (e as Error).message
				console.error('Error loading reactions:', e)
			} finally {
				this.loading = false
			}
		},

		async importVideos(
			videos: Array<{
				id: string
				title: string
				channel_name: string
				channel_id: string // Now required
				categories: string[]
				song_id: string
			}>,
		) {
			this.loading = true
			this.error = null
			let imported = 0

			try {
				const supabase = useSupabaseClient<Database>()

				// Filter out videos that already exist
				const newVideos = videos.filter(
					(video) =>
						!this.reactions.some(
							(reaction) => reaction.id === video.id,
						),
				)

				if (newVideos.length === 0) {
					return 0
				}

				const { data, error } = await supabase
					.from('reactions')
					.insert(newVideos)
					.select()

				if (error) throw error
				if (data) {
					this.reactions.push(...data)
					imported = data.length
				}

				return imported
			} catch (e) {
				this.error = (e as Error).message
				console.error('Error importing videos:', e)
				return 0
			} finally {
				this.loading = false
			}
		},

		async addReaction(reaction: Omit<Reaction, 'created_at'>) {
			this.loading = true
			this.error = null
			try {
				const supabase = useSupabaseClient<Database>()
				const { data, error } = await supabase
					.from('reactions')
					.insert(reaction)
					.select()
					.single()

				if (error) throw error
				if (data) {
					this.reactions.push(data)
				}
			} catch (e) {
				this.error = (e as Error).message
				console.error('Error adding reaction:', e)
			} finally {
				this.loading = false
			}
		},
		async updateReaction(
			id: string,
			updates: Partial<Omit<Reaction, 'id' | 'created_at'>>,
		) {
			try {
				const supabase = useSupabaseClient<Database>()
				const { error } = await supabase
					.from('reactions')
					.update(updates)
					.eq('id', id)

				if (error) throw error

				// Update the reaction in the local state
				const index = this.reactions.findIndex((r) => r.id === id)
				if (index !== -1) {
					this.reactions[index] = {
						...this.reactions[index],
						...updates,
					}
				}

				return true
			} catch (e) {
				console.error('Error updating reaction:', e)
				return false
			}
		},
		async deleteReaction(id: string) {
			this.loading = true
			this.error = null
			try {
				const supabase = useSupabaseClient<Database>()
				const { error } = await supabase
					.from('reactions')
					.delete()
					.eq('id', id)

				if (error) throw error
				this.reactions = this.reactions.filter(
					(reaction) => reaction.id !== id,
				)
			} catch (e) {
				this.error = (e as Error).message
				console.error('Error deleting reaction:', e)
			} finally {
				this.loading = false
			}
		},
		setSelectedSong(songId: string) {
			this.selectedSong = songId
		},
		setSelectedChannel(channelId: string) {
			this.selectedChannel = channelId
		},
		toggleCategory(category: string) {
			const index = this.selectedCategories.indexOf(category)
			if (index === -1) {
				this.selectedCategories.push(category)
			} else {
				this.selectedCategories.splice(index, 1)
			}
		},
		clearFilters() {
			this.selectedSong = ''
			this.selectedCategories = []
			this.selectedChannel = ''
		},
		async removeReaction(id: string) {
			try {
				const supabase = useSupabaseClient<Database>()
				const { error } = await supabase
					.from('reactions')
					.delete()
					.eq('id', id)

				if (error) throw error

				// Remove the reaction from the local state
				this.reactions = this.reactions.filter((r) => r.id !== id)
				return true
			} catch (e) {
				console.error('Error removing reaction:', e)
				return false
			}
		},
	},
})
