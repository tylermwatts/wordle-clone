import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export function useTodaysWord() {
	return useQuery(['todaysWord'], async () => {
		const { data } = await axios.get<string[]>(
			'https://random-word-api.herokuapp.com/word',
			{
				params: {
					length: 5,
				},
			}
		)
		const [word] = data
		return word
	})
}
