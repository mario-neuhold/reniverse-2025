/// <reference types="vitest" />

declare module '@/components/*.vue' {
	import type { DefineComponent } from 'vue'
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
	const component: DefineComponent<{}, {}, any>
	export default component
}

declare module '~/components/*.vue' {
	import type { DefineComponent } from 'vue'
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
	const component: DefineComponent<{}, {}, any>
	export default component
}
