<script setup lang="ts">
interface Props {
	id: string
	title: string
	genre?: string[]
	coArtists?: string[] | null
}

defineProps<Props>()
</script>

<template>
	<div
		class="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
	>
		<div class="aspect-video w-full">
			<iframe
				:src="`https://www.youtube.com/embed/${id}`"
				class="h-full w-full"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
		<div class="p-4">
			<h3
				class="mb-3 text-lg font-semibold text-gray-900 dark:text-white"
			>
				{{ title }}
			</h3>
			<div class="flex flex-wrap gap-2">
				<template v-if="genre">
					<span
						v-for="tag in genre"
						:key="tag"
						class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-100"
					>
						{{ tag }}
					</span>
				</template>
				<template v-if="coArtists">
					<span
						v-for="artist in coArtists"
						:key="artist"
						class="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800 dark:bg-purple-900 dark:text-purple-100"
					>
						{{ artist }}
					</span>
				</template>
			</div>
		</div>
	</div>
</template>
