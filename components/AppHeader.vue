<script setup lang="ts">
const nuxtApp = useNuxtApp()
const { activeHeadings, updateHeadings } = useScrollspy()

const items = computed(() => [
	{
		label: 'Quotes',
		to: '#quotes',
		active:
			activeHeadings.value.includes('quotes') &&
			!activeHeadings.value.includes('videos'),
	},
	{
		label: 'Music Videos',
		to: '#videos',
		active: activeHeadings.value.includes('videos'),
	},
	{
		label: 'Reactions',
		to: '#reactions',
		active:
			activeHeadings.value.includes('reactions') &&
			!activeHeadings.value.includes('videos'),
	},
])

nuxtApp.hooks.hookOnce('page:finish', () => {
	updateHeadings(
		[
			document.querySelector('#quotes'),
			document.querySelector('#videos'),
			document.querySelector('#reactions'),
		].filter(Boolean) as Element[],
	)
})
</script>
<template>
	<UHeader>
		<template #left>
			<NuxtLink to="/"> Reniverse </NuxtLink>
		</template>

		<template #right>
			<UNavigationMenu
				:items="items"
				variant="link"
				class="hidden lg:block"
			/>

			<UColorModeButton />
		</template>

		<template #body>
			<UNavigationMenu
				:items="items"
				orientation="vertical"
				class="-mx-2.5"
			/>
			<UButton
				class="mt-4"
				label="Download App"
				variant="subtle"
				block
			/>
		</template>
	</UHeader>
</template>
