import { defineStore } from 'pinia'

interface Song {
	id: string
	title: string
	genre: string[]
	coArtists?: string[]
}

export const useSongsStore = defineStore('songs', {
	state: () => ({
		songs: [
			{
				id: 's_nc1IVoMxc',
				title: 'Hi Ren',
				genre: ['Hip-Hop', 'Alternative'],
			},
			{
				id: 'TYAnqQ--KX0',
				title: 'The Tale of Jenny & Screech',
				genre: ['Folk', 'Storytelling'],
			},
			{
				id: '35yALr_opeg',
				title: 'Chalk Outlines',
				genre: ['Hip-Hop', 'Live Performance'],
				coArtists: ['Chinchilla'],
			},
			{
				id: '1T_fLytBFM4',
				title: 'The Hunger',
				genre: ['Alternative', 'Rock'],
			},
			{
				id: 'mLvAGjhDssc',
				title: 'Losing it',
				genre: ['Hip-Hop', 'Remix'],
				coArtists: ['FISHER'],
			},
			{
				id: 'J2H7wDR9eTU',
				title: '1990s',
				genre: ['Hip-Hop', 'Alternative'],
			},
			{
				id: '0ivQwwgW4OY',
				title: 'Money Game',
				genre: ['Hip-Hop', 'Political'],
			},
			{
				id: 'YonS9_QJbp8',
				title: 'Money Game Part 2',
				genre: ['Hip-Hop', 'Political'],
			},
			{
				id: 'nyWbun_PbTc',
				title: 'Money Game Part 3',
				genre: ['Hip-Hop', 'Political'],
			},
		] as Song[],
	}),
	getters: {
		getAllSongs: (state) => state.songs,
		getSongById: (state) => (id: string) =>
			state.songs.find((song) => song.id === id),
	},
})
