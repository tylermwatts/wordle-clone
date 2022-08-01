import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export function useValidWordDictionary() {
	return useQuery(
		['validWordDictionary'],
		async () => {
			const fiveLetterWordDictionary = await axios
				.get<string[]>('https://random-word-api.herokuapp.com/all')
				.then((res) => {
					const fiveLetterWordDictionary = res.data.filter(
						(w) => w.length === 5
					)
					return fiveLetterWordDictionary
				})
			return fiveLetterWordDictionary
		},
		{
			cacheTime: Infinity,
		}
	)
}
