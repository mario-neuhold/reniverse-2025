<script setup lang="ts">
import { computed } from 'vue'

interface Props {
	to?: string
	variant?: 'default' | 'primary' | 'secondary' | 'inverted'
}

const props = withDefaults(defineProps<Props>(), {
	to: '',
	variant: 'default',
})

const variantClasses = computed(() => {
	const baseClasses =
		'cursor-pointer rounded-lg px-6 py-3 font-semibold shadow-sm transition-shadow hover:shadow-lg'

	const variantSpecificClasses = {
		default:
			'bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700',
		primary:
			'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
		secondary:
			'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500',
		inverted:
			'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100',
	}

	return `${baseClasses} ${variantSpecificClasses[props.variant]}`
})
</script>

<template>
	<component
		:is="to ? 'nuxt-link' : 'button'"
		:to="to"
		:class="variantClasses"
	>
		<slot />
	</component>
</template>
