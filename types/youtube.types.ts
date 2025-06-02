// Shared types for YouTube playlist API, songs, and reactions stores

export interface VideoItem {
	id: string
	title: string
	genres?: string[]
	co_artists?: string[]
	channel_name?: string
	channel_id: string
	song_id?: string
	categories?: string[]
}
