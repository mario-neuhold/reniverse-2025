<script setup lang="ts">
import { useSongsStore } from '~/stores/songs'
import { useReactionsStore } from '~/stores/reactions'

const page = {
	title: 'Reniverse - Genre-defying Music',
	description:
		'Explore the genre-defying music of Ren, blending hip-hop, folk, and alternative styles. Discover powerful narratives through music and community reactions.',
	hero: {
		links: [
			{ label: 'Features', to: '#features' },
			{ label: 'Music Videos', to: '#videos' },
			{ label: 'Reactions', to: '#reactions' },
		],
	},
}

useSeoMeta({
	title: page.title,
	description: page.description,
	ogTitle: page.title,
	ogDescription: page.description,
})

const songsStore = useSongsStore()
const reactionsStore = useReactionsStore()

// Fetch data on component mount
onMounted(async () => {
	await Promise.all([
		songsStore.fetchSongs(),
		reactionsStore.fetchReactions(),
	])
})

const videos = computed(() => songsStore.getAllSongs)
const quotes = [
	{
		name: 'Andrew Lloyd Webber',
		description:
			"Ren is one of the most unique songwriters and storytellers I've seen in recent times.",
		icon: 'i-heroicons-lightning-bolt',
		date: '2023-10-17',
	},
	{
		name: 'Robbie Williams',
		description:
			'Can this person be the next person to be the person pls? Asking for a friend.',
		icon: 'i-heroicons-book-open',
		date: '2022-09-21',
		src: 'https://x.com/robbiewilliams/status/1572482296841650176',
	},
	{
		name: 'Sinéad O’Connor',
		description:
			"Holy motherfucking SHIT! Someone just showed me this at the weekend. This Archangel from like, twelfth heaven or somewhere, has only gone and made the entire history of songwriting and performing look like a three year old's birthday party at Burger King.",
		icon: 'i-heroicons-video-camera',
		date: '2023-05-17',
	},
	{
		name: 'Sinéad O’Connor',
		description:
			'Every song and or artist in history even Willie Dixon, Chuck Berry, The Beatles, NWA, Ice Cube, and even Bob Dylan, is officially relegated to class B. As are every actor in history or legend: living or dead, male or female. We all are now defunct.',
		icon: 'i-heroicons-video-camera',
		date: '2023-05-17',
	},
]

const reactionCategories = computed(() => reactionsStore.getCategories)
const filteredReactions = computed(() => reactionsStore.getFilteredReactions)
const isLoading = computed(() => songsStore.loading || reactionsStore.loading)
const error = computed(() => songsStore.error || reactionsStore.error)

const selectedSong = computed({
	get: () => reactionsStore.selectedSong,
	set: (value) => reactionsStore.setSelectedSong(value),
})

const toggleCategory = (category: string) =>
	reactionsStore.toggleCategory(category)
const isSelectedCategory = (category: string) =>
	reactionsStore.selectedCategories.includes(category)
</script>

<template>
	<div>
		<!-- Hero Section -->
		<UPageHero
			:description="page.description"
			:ui="{ container: 'md:pt-18 lg:pt-20' }"
		>
			<template #title>
				<h1 class="mx-auto max-w-3xl *:leading-11 sm:*:leading-19">
					Welcome to the universe of Ren:<br />
					<span class="text-primary">The Reniverse</span>
				</h1>
			</template>
		</UPageHero>

		<!-- Quotes Section with color bg -->
		<USeparator :ui="{ border: 'border-primary/30' }" />
		<UPageSection
			id="quotes"
			class="relative overflow-hidden"
		>
			<div
				class="bg-primary absolute top-10 -left-10 z-10 size-[300px] rounded-full opacity-30 blur-[200px]"
			/>
			<div
				class="bg-primary absolute -right-10 -bottom-10 z-10 size-[300px] rounded-full opacity-30 blur-[200px]"
			/>
			<h2
				class="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
			>
				What celebrities are saying about
				<span class="text-primary">Ren</span>
			</h2>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<UPageCard
					v-for="quote in quotes"
					:key="quote.name"
					:title="quote.name"
					:description="quote.date"
					spotlight
					spotlight-color="primary"
					>{{ quote.description }}</UPageCard
				>
			</div>
		</UPageSection>
		<USeparator :ui="{ border: 'border-primary/30' }" />

		<!-- Videos Section -->
		<UPageSection id="videos">
			<h2
				class="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white"
			>
				Music Videos
			</h2>
			<div class="mb-8">
				<ImportPlaylist />
			</div>
			<div
				v-if="error"
				class="mb-8 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900 dark:text-red-100"
			>
				{{ error }}
			</div>
			<div
				v-if="isLoading"
				class="flex justify-center py-12"
			>
				<div
					class="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
				></div>
			</div>
			<div
				v-else
				class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
			>
				<VideoCard
					v-for="video in videos"
					:id="video.id"
					:key="video.id"
					:title="video.title"
					:genre="video.genres"
					:co-artists="video.co_artists"
				/>
			</div>
		</UPageSection>

		<!-- Reactions Section -->
		<UPageSection id="reactions">
			<h2
				class="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white"
			>
				Community Reactions
			</h2>
			<p
				class="mb-8 text-center text-xl text-gray-600 dark:text-gray-300"
			>
				"A rising tide lifts all ships" - Explore how the community
				interprets and analyzes Ren's art
			</p>

			<!-- Filters -->
			<div
				class="mb-8 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800"
			>
				<div class="mb-6">
					<label
						class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Select a Song
					</label>
					<select
						v-model="selectedSong"
						class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					>
						<option value="">All Songs</option>
						<option
							v-for="video in videos"
							:key="video.id"
							:value="video.id"
						>
							{{ video.title }}
						</option>
					</select>
				</div>

				<div>
					<label
						class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						Filter by Category
					</label>
					<div class="flex flex-wrap gap-2">
						<button
							v-for="category in reactionCategories"
							:key="category"
							class="rounded-full px-4 py-2 text-sm transition-colors"
							:class="[
								isSelectedCategory(category)
									? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100'
									: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
							]"
							@click="toggleCategory(category)"
						>
							{{ category }}
						</button>
					</div>
				</div>
			</div>

			<!-- Reaction Videos Grid -->
			<div
				v-if="error"
				class="mb-8 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900 dark:text-red-100"
			>
				{{ error }}
			</div>
			<div
				v-if="isLoading"
				class="flex justify-center py-12"
			>
				<div
					class="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
				></div>
			</div>
			<div
				v-else
				class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
			>
				<ReactionCard
					v-for="reaction in filteredReactions"
					:id="reaction.id"
					:key="reaction.id"
					:title="reaction.title"
					:channel-name="reaction.channel_name"
					:categories="reaction.categories"
					:song-id="reaction.song_id"
				/>
			</div>
		</UPageSection>

		<!-- Footer -->
		<footer class="mt-20 bg-gray-100 py-8 dark:bg-gray-800">
			<div
				class="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 sm:flex-row sm:px-6 lg:px-8"
			>
				<div class="mb-4 text-gray-600 sm:mb-0 dark:text-gray-300">
					© {{ new Date().getFullYear() }} Ren. All rights reserved.
				</div>
				<div class="flex gap-6">
					<a
						href="#"
						class="hover:text-primary-500 dark:hover:text-primary-400 text-gray-600 dark:text-gray-300"
					>
						About
					</a>
					<a
						href="#"
						class="hover:text-primary-500 dark:hover:text-primary-400 text-gray-600 dark:text-gray-300"
					>
						Contact
					</a>
					<a
						href="#"
						class="hover:text-primary-500 dark:hover:text-primary-400 text-gray-600 dark:text-gray-300"
					>
						Privacy
					</a>
				</div>
			</div>
		</footer>
	</div>
</template>
