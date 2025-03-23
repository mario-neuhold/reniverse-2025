<script setup lang="ts">
interface Props {
	title: string
	description: string
	icon: string
}

defineProps<Props>()
</script>

<template>
	<div
		class="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
	>
		<div class="text-primary-500 mb-4 text-2xl">
			<div :class="icon"></div>
		</div>
		<h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
			{{ title }}
		</h3>
		<p class="text-gray-600 dark:text-gray-300">
			{{ description }}
		</p>
	</div>
</template>
