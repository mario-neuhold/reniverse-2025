import { google } from 'googleapis'
import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'
import { nanoid } from 'nanoid'

interface VideoItem {
	id: string
	title: string
	genres?: string[]
	co_artists?: string[]
	channel_name?: string
	channel_id?: string
	song_id?: string
	categories?: string[]
}

interface Song {
	id: string
	title: string
}

interface Channel {
	id: string
	name: string
	youtube_id: string
	categories: string[]
	avatar_url?: string
	description?: string
}

const youtube = google.youtube('v3')
const REN_CHANNEL_ID = 'UCBYGhpDjm4QkhdfMdlNVTNQ' // RenMakesMusic channel ID

// Helper function to try to match a reaction video to its original song
const findMatchingSongId = async (
	title: string,
	supabase: ReturnType<typeof serverSupabaseClient<Database>>,
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

// Helper to create or get a channel
const getOrCreateChannel = async (
	channelInfo: {
		name: string
		youtubeId: string
	},
	supabase: ReturnType<typeof serverSupabaseClient<Database>>,
) => {
	// Try to find existing channel by YouTube ID
	const { data: existingChannel } = await supabase
		.from('channels')
		.select('*')
		.eq('youtube_id', channelInfo.youtubeId)
		.single()

	if (existingChannel) {
		return existingChannel.id
	}

	// Create a new channel
	const newChannel: Omit<Channel, 'created_at'> = {
		id: `ch_${nanoid(10)}`,
		name: channelInfo.name,
		youtube_id: channelInfo.youtubeId,
		categories: ['To be classified'],
	}

	const { error } = await supabase.from('channels').insert(newChannel)

	if (error) {
		console.error('Error creating channel:', error)
		return null
	}

	return newChannel.id
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

		const supabase = await serverSupabaseClient<Database>(event)

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
		const channelsToProcess = new Map<
			string,
			{ name: string; youtubeId: string }
		>()

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
			} else if (snippet.videoOwnerChannelId) {
				// Store channel info for processing
				channelsToProcess.set(snippet.videoOwnerChannelId, {
					name: snippet.videoOwnerChannelTitle || 'Unknown Channel',
					youtubeId: snippet.videoOwnerChannelId,
				})
			}
		}

		// First, insert all songs so they're available for reactions to reference
		if (songs.length > 0) {
			const { error: songsError } = await supabase.from('songs').upsert(
				songs.map((song) => ({ ...song, genres: song.genres || [] })),
				{ onConflict: 'id' },
			) // Ensure genres is always a string[]
			if (songsError) {
				console.error('Error inserting songs:', songsError)
				throw songsError
			}
		}

		// Process all channels
		const channelIdMap = new Map<string, string>() // Maps YouTube channel IDs to our DB channel IDs
		for (const [
			youtubeChannelId,
			channelInfo,
		] of channelsToProcess.entries()) {
			const dbChannelId = await getOrCreateChannel(channelInfo, supabase)
			if (dbChannelId) {
				channelIdMap.set(youtubeChannelId, dbChannelId)
			}
		}

		// Second pass: process reactions and associate with channels
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
			if (songId && snippet.videoOwnerChannelId) {
				const dbChannelId = channelIdMap.get(
					snippet.videoOwnerChannelId,
				)

				reactions.push({
					id: videoId,
					title: snippet.title || '',
					channel_name:
						snippet.videoOwnerChannelTitle || 'Unknown Channel',
					channel_id: dbChannelId,
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
