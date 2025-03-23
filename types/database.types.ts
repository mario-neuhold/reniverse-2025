export interface Database {
	public: {
		Tables: {
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
					categories: string[]
					created_at: string
				}
				Insert: {
					id: string
					song_id: string
					title: string
					channel_name: string
					categories: string[]
					created_at?: string
				}
				Update: {
					id?: string
					song_id?: string
					title?: string
					channel_name?: string
					categories?: string[]
					created_at?: string
				}
			}
		}
	}
}
