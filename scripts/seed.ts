import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const supabaseUrl = 'https://zkylalaehbdzthgclexo.supabase.co'
const supabaseKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpreWxhbGFlaGJkenRoZ2NsZXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2OTU1MjEsImV4cCI6MjA1ODI3MTUyMX0.r_t2HjtwAAf1HbHMTkEvIks7bkEHytbKFYEf5tqy-Uo'

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

const initialSongs = [
	{
		id: 's_nc1IVoMxc',
		title: 'Hi Ren',
		genres: ['Hip-Hop', 'Alternative'],
	},
	{
		id: 'TYAnqQ--KX0',
		title: 'The Tale of Jenny & Screech',
		genres: ['Folk', 'Storytelling'],
	},
	{
		id: '35yALr_opeg',
		title: 'Chalk Outlines',
		genres: ['Hip-Hop', 'Live Performance'],
		co_artists: ['Chinchilla'],
	},
	{
		id: '1T_fLytBFM4',
		title: 'The Hunger',
		genres: ['Alternative', 'Rock'],
	},
	{
		id: 'mLvAGjhDssc',
		title: 'Losing it',
		genres: ['Hip-Hop', 'Remix'],
		co_artists: ['FISHER'],
	},
	{
		id: 'J2H7wDR9eTU',
		title: '1990s',
		genres: ['Hip-Hop', 'Alternative'],
	},
	{
		id: '0ivQwwgW4OY',
		title: 'Money Game',
		genres: ['Hip-Hop', 'Political'],
	},
	{
		id: 'YonS9_QJbp8',
		title: 'Money Game Part 2',
		genres: ['Hip-Hop', 'Political'],
	},
	{
		id: 'nyWbun_PbTc',
		title: 'Money Game Part 3',
		genres: ['Hip-Hop', 'Political'],
	},
]

const initialReactions = [
	{
		id: 'knox-1',
		song_id: 'TYAnqQ--KX0',
		title: 'Knox Hill - Jenny & Screech Reaction & Breakdown',
		channel_name: 'Knox Hill',
		categories: ['Lyrics Breakdown', 'Mental Health'],
	},
	{
		id: 'chris-1',
		song_id: 's_nc1IVoMxc',
		title: 'Vocal Coach Reacts to Hi Ren',
		channel_name: 'Chris Liepe',
		categories: ['Vocal Analysis', 'Musical Analysis'],
	},
	{
		id: 'charismatic-1',
		song_id: '0ivQwwgW4OY',
		title: 'Opera Singer Reacts to Money Game',
		channel_name: 'A Charismatic Voice',
		categories: [
			'Vocal Analysis',
			'First Time Reaction',
			'Emotional Response',
		],
	},
	{
		id: 'pegasus-1',
		song_id: 'nyWbun_PbTc',
		title: 'Money Game Part 3 - Real Rapper Reacts',
		channel_name: 'Black Pegasus',
		categories: ['Lyrics Breakdown', 'Musical Analysis'],
	},
]

async function seed() {
	try {
		// Insert songs
		const { error: songsError } = await supabase
			.from('songs')
			.insert(initialSongs)
		if (songsError) throw songsError

		console.log('✅ Songs inserted successfully')

		// Insert reactions
		const { error: reactionsError } = await supabase
			.from('reactions')
			.insert(initialReactions)
		if (reactionsError) throw reactionsError

		console.log('✅ Reactions inserted successfully')

		console.log('🎉 Database seeded successfully!')
	} catch (error) {
		console.error('Error seeding database:', error)
		process.exit(1)
	}
}

seed()
