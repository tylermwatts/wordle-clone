import React, { useEffect, useState } from 'react'

export function useLocalStorageState<TValue>(
	defaultValue: TValue,
	key: string
): [TValue, React.Dispatch<React.SetStateAction<TValue>>] {
	const [value, setValue] = useState<TValue>(() => {
		const localStorageValue = localStorage.getItem(key)

		return localStorageValue !== null
			? JSON.parse(localStorageValue)
			: defaultValue
	})

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value))
	}, [key, value])

	return [value, setValue]
}
