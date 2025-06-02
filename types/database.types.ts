export interface Database {
	public: {
		Tables: {
			channels: {
				Row: {
					id: string
					name: string
					youtube_id: string | null
					avatar_url: string | null
					categories: string[]
					description: string | null
					created_at: string
				}
				Insert: {
					id: string
					name: string
					youtube_id?: string | null
					avatar_url?: string | null
					categories: string[]
					description?: string | null
					created_at?: string
				}
				Update: {
					id?: string
					name?: string
					youtube_id?: string | null
					avatar_url?: string | null
					categories?: string[]
					description?: string | null
					created_at?: string
				}
			}
			songs: {
				Row: {
					id: string
					title: string
					genres: string[]
					co_artists: string[] | null
					created_at: string
				}
				Insert: {
					id: string
					title: string
					genres: string[]
					co_artists?: string[] | null
					created_at?: string
				}
				Update: {
					id?: string
					title?: string
					genres?: string[]
					co_artists?: string[] | null
					created_at?: string
				}
			}
			reactions: {
				Row: {
					id: string
					song_id: string
					title: string
					channel_name: string
					channel_id: string | null
					categories: string[]
					created_at: string
				}
				Insert: {
					id: string
					song_id: string
					title: string
					channel_name: string
					channel_id?: string | null
					categories: string[]
					created_at?: string
				}
				Update: {
					id?: string
					song_id?: string
					title?: string
					channel_name?: string
					channel_id?: string | null
					categories?: string[]
					created_at?: string
				}
			}
		}
	}
}
