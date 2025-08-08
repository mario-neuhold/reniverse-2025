<script setup lang="ts">
interface Props {
	text: string
}

defineProps<Props>()
</script>

<template>
	<li
		class="rounded-lg bg-white p-4 text-center shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
	>
		{{ text }}
	</li>
</template>
