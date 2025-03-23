import { defineStore } from 'pinia'

interface Reaction {
	id: string
	songId: string
	title: string
	channelName: string
	categories: string[]
}

export const useReactionsStore = defineStore('reactions', {
	state: () => ({
		categories: [
			'Vocal Analysis',
			'Lyrics Breakdown',
			'Emotional Response',
			'Mental Health',
			'Musical Analysis',
			'First Time Reaction',
			'Producer Review',
		] as string[],
		reactions: [
			{
				id: 'example1',
				songId: 's_nc1IVoMxc',
				title: 'Vocal Coach Reacts to Hi Ren',
				channelName: 'Chris Liepe',
				categories: ['Vocal Analysis', 'Musical Analysis'],
			},
			{
				id: 'example2',
				songId: 'TYAnqQ--KX0',
				title: 'Knox Hill - Jenny & Screech Reaction & Breakdown',
				channelName: 'Knox Hill',
				categories: ['Lyrics Breakdown', 'Mental Health'],
			},
			{
				id: 'example3',
				songId: '0ivQwwgW4OY',
				title: 'Opera Singer Reacts to Money Game',
				channelName: 'A Charismatic Voice',
				categories: [
					'Vocal Analysis',
					'First Time Reaction',
					'Emotional Response',
				],
			},
			{
				id: 'example4',
				songId: 'nyWbun_PbTc',
				title: 'Money Game Part 3 - Real Rapper Reacts',
				channelName: 'Black Pegasus',
				categories: ['Lyrics Breakdown', 'Musical Analysis'],
			},
		] as Reaction[],
		selectedSong: '',
		selectedCategories: [] as string[],
	}),
	getters: {
		getCategories: (state) => state.categories,
		getAllReactions: (state) => state.reactions,
		getFilteredReactions: (state) => {
			return state.reactions.filter((reaction) => {
				const matchesSong =
					!state.selectedSong ||
					reaction.songId === state.selectedSong
				const matchesCategories =
					state.selectedCategories.length === 0 ||
					state.selectedCategories.some((cat) =>
						reaction.categories.includes(cat),
					)
				return matchesSong && matchesCategories
			})
		},
		getReactionsBySong: (state) => (songId: string) =>
			state.reactions.filter((reaction) => reaction.songId === songId),
	},
	actions: {
		setSelectedSong(songId: string) {
			this.selectedSong = songId
		},
		toggleCategory(category: string) {
			const index = this.selectedCategories.indexOf(category)
			if (index === -1) {
				this.selectedCategories.push(category)
			} else {
				this.selectedCategories.splice(index, 1)
			}
		},
		clearFilters() {
			this.selectedSong = ''
			this.selectedCategories = []
		},
	},
})
