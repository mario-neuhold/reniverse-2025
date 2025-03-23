<script setup lang="ts">
interface Props {
	to?: string
	variant?: 'default' | 'primary' | 'secondary'
}

withDefaults(defineProps<Props>(), {
	to: '',
	variant: 'default',
})
</script>

<template>
	<component
		:is="to ? 'nuxt-link' : 'button'"
		:to="to"
		class="cursor-pointer rounded-lg px-6 py-3 font-semibold shadow-sm transition-shadow hover:shadow-lg"
		:class="[
			variant === 'default'
				? 'bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
				: '',
		]"
	>
		<slot />
	</component>
</template>
