<script setup lang="ts">
import { useChannelsStore } from '~/stores/channels'
import { useReactionsStore } from '~/stores/reactions'
import { useSongsStore } from '~/stores/songs'

const route = useRoute()
const channelId = route.params.id as string
const channelsStore = useChannelsStore()
const reactionsStore = useReactionsStore()
const songsStore = useSongsStore()

// Fetch all necessary data
onMounted(async () => {
	if (!channelsStore.channels.length) {
		await channelsStore.fetchChannels()
	}
	if (!reactionsStore.reactions.length) {
		await reactionsStore.fetchReactions()
	}
	if (!songsStore.getAllSongs.length) {
		await songsStore.fetchSongs()
	}
})

// Get channel details
const channel = computed(() => {
	return channelsStore.getChannelById(channelId)
})

// Get all reactions for this channel
const channelReactions = computed(() => {
	return reactionsStore.getReactionsByChannel(channelId)
})

// Get stats
const stats = computed(() => {
	if (!channel.value) return { songCount: 0, categoryCount: 0 }

	const uniqueSongs = new Set(channelReactions.value.map((r) => r.song_id))
	const uniqueCategories = new Set(
		channelReactions.value.flatMap((r) => r.categories),
	)

	return {
		songCount: uniqueSongs.size,
		categoryCount: uniqueCategories.size,
	}
})

// Get song titles for display
// const getSongTitle = (songId: string) => {
// 	return songsStore.getSongById(songId)?.title || 'Unknown Song'
// }

// Helper to generate YouTube channel URL
const youtubeChannelUrl = computed(() => {
	if (!channel.value?.youtube_id) return null
	return `https://www.youtube.com/channel/${channel.value.youtube_id}`
})
</script>

<template>
	<div
		class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
	>
		<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<!-- Loading state -->
			<div
				v-if="!channel"
				class="flex justify-center py-12"
			>
				<div
					class="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
				></div>
			</div>

			<!-- Channel details -->
			<div v-else>
				<!-- Channel header -->
				<div
					class="mb-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800"
				>
					<div
						class="flex flex-col items-center gap-6 md:flex-row md:items-start"
					>
						<!-- Channel avatar -->
						<div
							v-if="channel.avatar_url"
							class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
						>
							<img
								:src="channel.avatar_url"
								:alt="channel.name"
								class="h-full w-full object-cover"
							/>
						</div>
						<div
							v-else
							class="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
						>
							<div class="text-4xl text-gray-400">
								{{ channel.name.charAt(0).toUpperCase() }}
							</div>
						</div>

						<!-- Channel info -->
						<div class="flex-1 text-center md:text-left">
							<h1
								class="mb-2 text-3xl font-bold text-gray-900 dark:text-white"
							>
								{{ channel.name }}
							</h1>

							<!-- Categories -->
							<div
								class="mb-4 flex flex-wrap justify-center gap-2 md:justify-start"
							>
								<span
									v-for="category in channel.categories"
									:key="category"
									class="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800 dark:bg-purple-900 dark:text-purple-100"
								>
									{{ category }}
								</span>
							</div>

							<!-- Description -->
							<p
								v-if="channel.description"
								class="mb-4 text-gray-600 dark:text-gray-300"
							>
								{{ channel.description }}
							</p>
							<p
								v-else
								class="mb-4 text-gray-500 italic dark:text-gray-400"
							>
								No description available
							</p>

							<!-- Stats -->
							<div
								class="flex justify-center gap-6 md:justify-start"
							>
								<div class="text-center">
									<div
										class="text-xl font-bold text-gray-900 dark:text-white"
									>
										{{ channelReactions.length }}
									</div>
									<div
										class="text-sm text-gray-500 dark:text-gray-400"
									>
										Reactions
									</div>
								</div>
								<div class="text-center">
									<div
										class="text-xl font-bold text-gray-900 dark:text-white"
									>
										{{ stats.songCount }}
									</div>
									<div
										class="text-sm text-gray-500 dark:text-gray-400"
									>
										Songs
									</div>
								</div>
								<div class="text-center">
									<div
										class="text-xl font-bold text-gray-900 dark:text-white"
									>
										{{ stats.categoryCount }}
									</div>
									<div
										class="text-sm text-gray-500 dark:text-gray-400"
									>
										Categories
									</div>
								</div>
							</div>
						</div>

						<!-- Action buttons -->
						<div class="md:self-start">
							<a
								v-if="youtubeChannelUrl"
								:href="youtubeChannelUrl"
								target="_blank"
								rel="noopener"
								class="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
							>
								<span
									class="i-heroicons-video-camera"
									aria-hidden="true"
								></span>
								YouTube Channel
							</a>
						</div>
					</div>
				</div>

				<!-- Reactions -->
				<h2
					class="mb-6 text-2xl font-bold text-gray-900 dark:text-white"
				>
					Reactions ({{ channelReactions.length }})
				</h2>

				<div
					v-if="channelReactions.length === 0"
					class="rounded-xl bg-white p-12 text-center dark:bg-gray-800"
				>
					<p class="text-lg text-gray-600 dark:text-gray-300">
						No reactions found for this channel yet.
					</p>
				</div>

				<div
					v-else
					class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
				>
					<ReactionCard
						v-for="reaction in channelReactions"
						:id="reaction.id"
						:key="reaction.id"
						:title="reaction.title"
						:channel-name="channel.name"
						:channel-id="channelId"
						:categories="reaction.categories"
						:song-id="reaction.song_id"
					/>
				</div>
			</div>
		</div>
	</div>
</template>
