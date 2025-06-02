<script setup lang="ts">
import { useSongsStore } from '~/stores/songs'
import { useReactionsStore } from '~/stores/reactions'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { VideoItem } from '~/types/youtube.types'

const songsStore = useSongsStore()
const reactionsStore = useReactionsStore()

const state = reactive({
	playlistInput: '',
})
const isLoading = ref(false)
const error = ref<string | null>(null)
const importedItems = ref<{ songs: number; reactions: number }>({
	songs: 0,
	reactions: 0,
})

const extractPlaylistId = (input: string) => {
	// Handle full URLs
	const urlMatch = input.match(/[?&]list=([^&]+)/)
	if (urlMatch) return urlMatch[1]

	// Handle direct IDs
	if (input.match(/^PL[a-zA-Z0-9_-]{32}$/)) return input

	return null
}

const importPlaylist = async (e: FormSubmitEvent<typeof state>) => {
	error.value = null
	isLoading.value = true
	importedItems.value = { songs: 0, reactions: 0 }

	console.log(e)

	try {
		const playlistId = extractPlaylistId(state.playlistInput)
		if (!playlistId) {
			throw new Error('Invalid playlist URL or ID')
		}

		const { data } = await useFetch(`/api/youtube/playlist/${playlistId}`)

		if (!data.value) {
			throw new Error('Failed to fetch playlist data')
		}

		// Convert serialized data back to proper types
		const playlistData = data.value as {
			songs: VideoItem[]
			reactions: VideoItem[]
		}

		const results = await Promise.all([
			songsStore.importVideos(playlistData.songs),
			reactionsStore.importVideos(playlistData.reactions),
		])

		importedItems.value = {
			songs: results[0],
			reactions: results[1],
		}

		state.playlistInput = ''
	} catch (e) {
		error.value = e instanceof Error ? e.message : 'An error occurred'
	} finally {
		isLoading.value = false
	}
}
</script>

<template>
	<UPageCard
		title="Import from YouTube Playlist"
		class="mx-auto w-1/3"
	>
		<UForm
			class="space-y-4"
			:state="state"
			@submit="importPlaylist"
		>
			<div>
				<UFormField
					label="Playlist URL or ID"
					name="playlistInput"
					required
				>
					<UInput
						v-model="state.playlistInput"
						placeholder="Enter playlist URL or ID"
					/>
				</UFormField>
			</div>

			<div
				v-if="error"
				class="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900 dark:text-red-100"
			>
				{{ error }}
			</div>

			<div
				v-if="importedItems.songs > 0 || importedItems.reactions > 0"
				class="rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900 dark:text-green-100"
			>
				Successfully imported:
				<ul class="mt-2 list-inside list-disc">
					<li v-if="importedItems.songs">
						{{ importedItems.songs }} songs
					</li>
					<li v-if="importedItems.reactions">
						{{ importedItems.reactions }} reactions
					</li>
				</ul>
			</div>

			<UButton :disabled="isLoading">
				<span v-if="isLoading">Importing...</span>
				<span v-else>Import Playlist</span>
			</UButton>
		</UForm>
	</UPageCard>
</template>
