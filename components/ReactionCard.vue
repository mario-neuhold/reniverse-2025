<script setup lang="ts">
interface Props {
	id: string
	title: string
	channelName: string
	categories: string[]
	songId: string
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
				class="mb-2 text-lg font-semibold text-gray-900 dark:text-white"
			>
				{{ title }}
			</h3>
			<p class="mb-3 text-gray-600 dark:text-gray-300">
				{{ channelName }}
			</p>
			<div class="flex flex-wrap gap-2">
				<span
					v-for="category in categories"
					:key="category"
					class="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800 dark:bg-green-900 dark:text-green-100"
				>
					{{ category }}
				</span>
			</div>
		</div>
	</div>
</template>
