<script setup lang="ts">
import { useSongsStore } from '~/stores/songs'
import { useReactionsStore } from '~/stores/reactions'

const songsStore = useSongsStore()
const reactionsStore = useReactionsStore()

const playlistInput = ref('')
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

const importPlaylist = async () => {
	error.value = null
	isLoading.value = true
	importedItems.value = { songs: 0, reactions: 0 }

	try {
		const playlistId = extractPlaylistId(playlistInput.value)
		if (!playlistId) {
			throw new Error('Invalid playlist URL or ID')
		}

		const { data } = await useFetch(`/api/youtube/playlist/${playlistId}`)

		if (!data.value) {
			throw new Error('Failed to fetch playlist data')
		}

		const results = await Promise.all([
			songsStore.importVideos(data.value.songs),
			reactionsStore.importVideos(data.value.reactions),
		])

		importedItems.value = {
			songs: results[0],
			reactions: results[1],
		}

		playlistInput.value = ''
	} catch (e) {
		error.value = e instanceof Error ? e.message : 'An error occurred'
	} finally {
		isLoading.value = false
	}
}
</script>

<template>
	<div class="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
		<h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
			Import from YouTube Playlist
		</h3>
		<form
			class="space-y-4"
			@submit.prevent="importPlaylist"
		>
			<div>
				<label
					class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
				>
					Playlist URL or ID
				</label>
				<input
					v-model="playlistInput"
					type="text"
					placeholder="Enter playlist URL or ID"
					class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					:disabled="isLoading"
				/>
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

			<BaseButton
				type="submit"
				:disabled="isLoading"
				variant="inverted"
			>
				<span v-if="isLoading">Importing...</span>
				<span v-else>Import Playlist</span>
			</BaseButton>
		</form>
	</div>
</template>
