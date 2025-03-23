import { google } from 'googleapis'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

interface VideoItem {
	id: string
	title: string
	genres?: string[]
	co_artists?: string[]
	channel_name?: string
	song_id?: string
	categories?: string[]
}

interface Song {
	id: string
	title: string
}

const youtube = google.youtube('v3')
const REN_CHANNEL_ID = 'UCEUNy-tJh9Q2tEDS8pfcp4w' // RenMakesMusic channel ID

// Helper function to try to match a reaction video to its original song
const findMatchingSongId = async (
	title: string,
	supabase: ReturnType<typeof createClient<Database>>,
) => {
	// Get all songs from the database
	const { data: songs } = await supabase.from('songs').select('id, title')

	if (!songs) return null

	// Try to find a matching song by looking for its title in the reaction title
	return (
		songs.find((song: Song) =>
			title.toLowerCase().includes(song.title.toLowerCase()),
		)?.id || null
	)
}

export default defineEventHandler(async (event) => {
	const playlistId = event.context.params?.id
	if (!playlistId) {
		throw createError({
			statusCode: 400,
			message: 'Playlist ID is required',
		})
	}

	try {
		const apiKey = process.env.YOUTUBE_API_KEY
		if (!apiKey) {
			throw new Error('YouTube API key is not configured')
		}

		const supabaseUrl = process.env.SUPABASE_URL
		const supabaseKey = process.env.SUPABASE_KEY
		if (!supabaseUrl || !supabaseKey) {
			throw new Error('Supabase configuration is missing')
		}

		const supabase = createClient<Database>(supabaseUrl, supabaseKey)

		const response = await youtube.playlistItems.list({
			key: apiKey,
			part: ['snippet', 'contentDetails'],
			playlistId,
			maxResults: 50,
		})

		if (!response.data.items) {
			throw new Error('No items found in playlist')
		}

		const songs: VideoItem[] = []
		const reactions: VideoItem[] = []

		// First pass: collect all songs
		for (const item of response.data.items) {
			const videoId = item.contentDetails?.videoId
			const snippet = item.snippet

			if (!videoId || !snippet) continue

			const videoData = {
				id: videoId,
				title: snippet.title || '',
				channelId: snippet.videoOwnerChannelId,
			}

			// If it's from Ren's channel, add it to songs
			if (videoData.channelId === REN_CHANNEL_ID) {
				songs.push({
					id: videoData.id,
					title: videoData.title,
					genres: ['To be classified'],
				})
			}
		}

		// First, insert all songs so they're available for reactions to reference
		if (songs.length > 0) {
			const { error: songsError } = await supabase
				.from('songs')
				.upsert(songs, { onConflict: 'id' })

			if (songsError) {
				console.error('Error inserting songs:', songsError)
				throw songsError
			}
		}

		// Second pass: process reactions and try to match them to songs
		for (const item of response.data.items) {
			const videoId = item.contentDetails?.videoId
			const snippet = item.snippet

			if (
				!videoId ||
				!snippet ||
				snippet.videoOwnerChannelId === REN_CHANNEL_ID
			) {
				continue
			}

			// Try to find a matching song for this reaction
			const songId = await findMatchingSongId(
				snippet.title || '',
				supabase,
			)

			// Only add reactions that we can match to a song
			if (songId) {
				reactions.push({
					id: videoId,
					title: snippet.title || '',
					channel_name:
						snippet.videoOwnerChannelTitle || 'Unknown Channel',
					song_id: songId,
					categories: ['To be classified'],
				})
			}
		}

		return {
			songs,
			reactions,
		}
	} catch (error) {
		console.error('YouTube API Error:', error)
		throw createError({
			statusCode: 500,
			message:
				error instanceof Error
					? error.message
					: 'Failed to fetch playlist data',
		})
	}
})
