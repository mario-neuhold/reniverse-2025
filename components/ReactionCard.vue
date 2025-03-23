<script setup lang="ts">
interface Props {
	id: string
	title: string
	channelName: string
	categories: string[]
	songId: string
}

const props = defineProps<Props>()
const isPlaying = ref(false)

const thumbnailUrl = computed(
	() => `https://i.ytimg.com/vi/${props.id}/hqdefault.jpg`,
)
</script>

<template>
	<div
		class="group overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
	>
		<div class="relative aspect-video w-full">
			<iframe
				v-if="isPlaying"
				:src="`https://www.youtube.com/embed/${id}?autoplay=1`"
				class="absolute inset-0 z-20 h-full w-full"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
			<button
				v-show="!isPlaying"
				class="group relative z-10 block h-full w-full"
				@click="isPlaying = true"
			>
				<img
					:src="thumbnailUrl"
					:alt="title"
					class="h-full w-full object-cover"
				/>
				<div class="absolute inset-0 flex items-center justify-center">
					<div
						class="bg-opacity-70 transform rounded-full bg-black p-4 transition-transform group-hover:scale-110"
					>
						<div
							class="ml-1 h-0 w-0 border-t-8 border-b-8 border-l-[16px] border-t-transparent border-b-transparent border-l-white"
						></div>
					</div>
				</div>
			</button>
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
