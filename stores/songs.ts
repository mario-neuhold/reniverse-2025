import { defineStore } from 'pinia'
import type { Database } from '~/types/database.types'

type Song = Database['public']['Tables']['songs']['Row']

export const useSongsStore = defineStore('songs', {
	state: () => ({
		songs: [] as Song[],
		loading: false,
		error: null as string | null,
	}),
	getters: {
		getAllSongs: (state) => state.songs,
		getSongById: (state) => (id: string) =>
			state.songs.find((song) => song.id === id),
	},
	actions: {
		async fetchSongs() {
			this.loading = true
			this.error = null
			try {
				const supabase = useSupabaseClient<Database>()
				const { data, error } = await supabase
					.from('songs')
					.select('*')
					.order('created_at', { ascending: true })

				if (error) throw error
				this.songs = data
			} catch (e) {
				this.error = (e as Error).message
				console.error('Error loading songs:', e)
			} finally {
				this.loading = false
			}
		},

		async importVideos(
			videos: Array<{ id: string; title: string; genres: string[] }>,
		) {
			this.loading = true
			this.error = null
			let imported = 0

			try {
				const supabase = useSupabaseClient<Database>()

				// Filter out videos that already exist
				const newVideos = videos.filter(
					(video) => !this.songs.some((song) => song.id === video.id),
				)

				if (newVideos.length === 0) {
					return 0
				}

				const { data, error } = await supabase
					.from('songs')
					.insert(newVideos)
					.select()

				if (error) throw error
				if (data) {
					this.songs.push(...data)
					imported = data.length
				}

				return imported
			} catch (e) {
				this.error = (e as Error).message
				console.error('Error importing songs:', e)
				return 0
			} finally {
				this.loading = false
			}
		},

		async addSong(song: Omit<Song, 'created_at'>) {
			this.loading = true
			this.error = null
			try {
				const supabase = useSupabaseClient<Database>()
				const { data, error } = await supabase
					.from('songs')
					.insert(song)
					.select()
					.single()

				if (error) throw error
				if (data) {
					this.songs.push(data)
				}
			} catch (e) {
				this.error = (e as Error).message
				console.error('Error adding song:', e)
			} finally {
				this.loading = false
			}
		},
		async updateSong(
			id: string,
			updates: Partial<Omit<Song, 'id' | 'created_at'>>,
		) {
			this.loading = true
			this.error = null
			try {
				const supabase = useSupabaseClient<Database>()
				const { data, error } = await supabase
					.from('songs')
					.update(updates)
					.eq('id', id)
					.select()
					.single()

				if (error) throw error
				if (data) {
					const index = this.songs.findIndex((song) => song.id === id)
					if (index !== -1) {
						this.songs[index] = data
					}
				}
			} catch (e) {
				this.error = (e as Error).message
				console.error('Error updating song:', e)
			} finally {
				this.loading = false
			}
		},
		async deleteSong(id: string) {
			this.loading = true
			this.error = null
			try {
				const supabase = useSupabaseClient<Database>()
				const { error } = await supabase
					.from('songs')
					.delete()
					.eq('id', id)

				if (error) throw error
				this.songs = this.songs.filter((song) => song.id !== id)
			} catch (e) {
				this.error = (e as Error).message
				console.error('Error deleting song:', e)
			} finally {
				this.loading = false
			}
		},
	},
})
