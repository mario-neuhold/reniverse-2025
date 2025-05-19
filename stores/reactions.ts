import { defineStore } from 'pinia'
import type { Database } from '~/types/database.types'
import type { VideoItem } from '~/types/youtube.types'

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
				return matchesSong && matchesCategories
			})
		},
		getReactionsBySong: (state) => (songId: string) =>
			state.reactions.filter((reaction) => reaction.song_id === songId),
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

		async importVideos(videos: VideoItem[]) {
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
				console.error('Error importing reactions:', e)
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
			this.loading = true
			this.error = null
			try {
				const supabase = useSupabaseClient<Database>()
				const { data, error } = await supabase
					.from('reactions')
					.update(updates)
					.eq('id', id)
					.select()
					.single()

				if (error) throw error
				if (data) {
					const index = this.reactions.findIndex(
						(reaction) => reaction.id === id,
					)
					if (index !== -1) {
						this.reactions[index] = data
					}
				}
			} catch (e) {
				this.error = (e as Error).message
				console.error('Error updating reaction:', e)
			} finally {
				this.loading = false
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
		},
	},
})
