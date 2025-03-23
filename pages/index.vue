<script setup lang="ts">
const videos = [
	{
		id: 's_nc1IVoMxc',
		title: 'Hi Ren',
		genre: ['Hip-Hop', 'Alternative'],
	},
	{
		id: 'TYAnqQ--KX0',
		title: 'The Tale of Jenny & Screech',
		genre: ['Folk', 'Storytelling'],
	},
	{
		id: '35yALr_opeg',
		title: 'Chalk Outlines',
		genre: ['Hip-Hop', 'Live Performance'],
		coArtists: ['Chinchilla'],
	},
	{
		id: '1T_fLytBFM4',
		title: 'The Hunger',
		genre: ['Alternative', 'Rock'],
	},
	{
		id: 'mLvAGjhDssc',
		title: 'Losing it',
		genre: ['Hip-Hop', 'Remix'],
		coArtists: ['FISHER'],
	},
	{
		id: 'J2H7wDR9eTU',
		title: '1990s',
		genre: ['Hip-Hop', 'Alternative'],
	},
	{
		id: '0ivQwwgW4OY',
		title: 'Money Game',
		genre: ['Hip-Hop', 'Political'],
	},
	{
		id: 'YonS9_QJbp8',
		title: 'Money Game Part 2',
		genre: ['Hip-Hop', 'Political'],
	},
	{
		id: 'nyWbun_PbTc',
		title: 'Money Game Part 3',
		genre: ['Hip-Hop', 'Political'],
	},
]

const features = [
	{
		title: 'Genre-Blending Artist',
		description:
			'Ren seamlessly blends hip-hop, folk, and alternative styles to create a unique sound that defies traditional categorization.',
		icon: 'i-heroicons-musical-note',
	},
	{
		title: 'Storytelling Through Music',
		description:
			'Each song weaves intricate narratives that tackle complex themes, from personal struggles to societal issues.',
		icon: 'i-heroicons-book-open',
	},
	{
		title: 'Visual Artistry',
		description:
			'Compelling music videos that bring stories to life through creative visuals and powerful performances.',
		icon: 'i-heroicons-video-camera',
	},
]

const reactionCategories = [
	'Vocal Analysis',
	'Lyrics Breakdown',
	'Emotional Response',
	'Mental Health',
	'Musical Analysis',
	'First Time Reaction',
	'Producer Review',
]

const reactions = [
	{
		id: 'example1',
		songId: 's_nc1IVoMxc',
		title: 'Vocal Coach Reacts to Hi Ren',
		channelName: 'Chris Liepe',
		categories: ['Vocal Analysis', 'Musical Analysis'],
	},
	{
		id: 'example2',
		songId: 'TYAnqQ--KX0',
		title: 'Knox Hill - Jenny & Screech Reaction & Breakdown',
		channelName: 'Knox Hill',
		categories: ['Lyrics Breakdown', 'Mental Health'],
	},
	{
		id: 'example3',
		songId: '0ivQwwgW4OY',
		title: 'Opera Singer Reacts to Money Game',
		channelName: 'A Charismatic Voice',
		categories: [
			'Vocal Analysis',
			'First Time Reaction',
			'Emotional Response',
		],
	},
	{
		id: 'example4',
		songId: 'nyWbun_PbTc',
		title: 'Money Game Part 3 - Real Rapper Reacts',
		channelName: 'Black Pegasus',
		categories: ['Lyrics Breakdown', 'Musical Analysis'],
	},
]

const selectedSong = ref('')
const selectedCategories = ref<string[]>([])

const filteredReactions = computed(() => {
	return reactions.filter((reaction) => {
		const matchesSong =
			!selectedSong.value || reaction.songId === selectedSong.value
		const matchesCategories =
			selectedCategories.value.length === 0 ||
			selectedCategories.value.some((cat) =>
				reaction.categories.includes(cat),
			)
		return matchesSong && matchesCategories
	})
})

const toggleCategory = (category: string) => {
	const index = selectedCategories.value.indexOf(category)
	if (index === -1) {
		selectedCategories.value.push(category)
	} else {
		selectedCategories.value.splice(index, 1)
	}
}
</script>

<template>
	<div
		class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
	>
		<!-- Hero Section -->
		<header class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1
					class="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl dark:text-white"
				>
					Ren
				</h1>
				<p
					class="mx-auto mb-10 max-w-3xl text-xl text-gray-600 dark:text-gray-300"
				>
					Genre-defying musician blending hip-hop, folk, and
					alternative styles to create powerful narratives through
					music.
				</p>
				<div class="flex justify-center gap-4">
					<BaseButton to="#videos">Watch Videos</BaseButton>
				</div>
			</div>
		</header>

		<!-- Features Section -->
		<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<h2
				class="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
			>
				About the Artist
			</h2>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<FeatureCard
					v-for="feature in features"
					:key="feature.title"
					:title="feature.title"
					:description="feature.description"
					:icon="feature.icon"
				/>
			</div>
		</section>

		<!-- Videos Section -->
		<section
			id="videos"
			class="mx-auto max-w-7xl rounded-xl bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 dark:bg-gray-900"
		>
			<h2
				class="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white"
			>
				Music Videos
			</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				<VideoCard
					v-for="video in videos"
					:id="video.id"
					:key="video.id"
					:title="video.title"
					:genre="video.genre"
					:co-artists="video.coArtists"
				/>
			</div>
		</section>

		<!-- Reactions Section -->
		<section class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
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
						>Select a Song</label
					>
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
						>Filter by Category</label
					>
					<div class="flex flex-wrap gap-2">
						<button
							v-for="category in reactionCategories"
							:key="category"
							class="rounded-full px-4 py-2 text-sm transition-colors"
							:class="[
								selectedCategories.includes(category)
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
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				<ReactionCard
					v-for="reaction in filteredReactions"
					:id="reaction.id"
					:key="reaction.id"
					:title="reaction.title"
					:channel-name="reaction.channelName"
					:categories="reaction.categories"
					:song-id="reaction.songId"
				/>
			</div>
		</section>

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
