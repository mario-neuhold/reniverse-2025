<script setup lang="ts">
const list = [
	'Item 1',
	'Item 2',
	'Item 3',
	'Item 4',
	'Item 5',
	'Item 6',
	'Item 7',
	'Item 8',
	'Item 9',
	'Item 10',
]

const features = [
	{
		title: 'Feature 1',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
		icon: 'i-heroicons-star',
	},
	{
		title: 'Feature 2',
		description:
			'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
		icon: 'i-heroicons-bolt',
	},
	{
		title: 'Feature 3',
		description:
			'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.',
		icon: 'i-heroicons-globe-alt',
	},
]
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
					Reniverse
				</h1>
				<p
					class="mx-auto mb-10 max-w-3xl text-xl text-gray-600 dark:text-gray-300"
				>
					Welcome to the future of digital experiences. Discover what
					makes Reniverse special.
				</p>
				<div class="flex justify-center gap-4">
					<BaseButton to="#start">Get Started</BaseButton>
				</div>
			</div>
		</header>

		<!-- Features Section -->
		<section
			id="start"
			class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
		>
			<h2
				class="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white"
			>
				Key Features
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

		<!-- List Section -->
		<section
			class="mx-auto max-w-7xl rounded-xl bg-gray-50 px-4 py-16 sm:px-6 lg:px-8 dark:bg-gray-900"
		>
			<h2
				class="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white"
			>
				Our Offerings
			</h2>
			<ul
				class="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
			>
				<ListItem
					v-for="item in list"
					:key="item"
					:text="item"
				/>
			</ul>
		</section>

		<!-- CTA Section -->
		<section
			class="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8"
		>
			<h2 class="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
				Ready to dive in?
			</h2>
			<p
				class="mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-300"
			>
				Join thousands of users who are already experiencing the power
				of Reniverse.
			</p>
			<BaseButton to="/signup">Sign Up Now</BaseButton>
		</section>

		<!-- Footer -->
		<footer class="mt-20 bg-gray-100 py-8 dark:bg-gray-800">
			<div
				class="mx-auto flex max-w-7xl flex-col items-center justify-between px-4 sm:flex-row sm:px-6 lg:px-8"
			>
				<div class="mb-4 text-gray-600 sm:mb-0 dark:text-gray-300">
					© {{ new Date().getFullYear() }} Reniverse. All rights
					reserved.
				</div>
				<div class="flex gap-6">
					<a
						href="#"
						class="hover:text-primary-500 dark:hover:text-primary-400 text-gray-600 dark:text-gray-300"
						>About</a
					>
					<a
						href="#"
						class="hover:text-primary-500 dark:hover:text-primary-400 text-gray-600 dark:text-gray-300"
						>Contact</a
					>
					<a
						href="#"
						class="hover:text-primary-500 dark:hover:text-primary-400 text-gray-600 dark:text-gray-300"
						>Privacy</a
					>
				</div>
			</div>
		</footer>
	</div>
</template>
