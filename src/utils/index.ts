import dayjs from 'dayjs'
import { GameRecord } from '../interfaces'
import { GuessRecord } from './../interfaces/index'

const BASE_STREAK_COUNT = 1

export function getCurrentStreak(winDates: string[]): number {
	const today = dayjs().format('YYYY-MM-DD')
	if (!winDates.length || !winDates.includes(today)) return 0

	let currentStreak = BASE_STREAK_COUNT

	for (let i = BASE_STREAK_COUNT; i < winDates.length; i++) {
		const dayToCheck = dayjs(today).subtract(i).format('YYYY-MM-DD')
		if (winDates.includes(dayToCheck)) {
			currentStreak++
		} else {
			break
		}
	}

	return currentStreak
}

export function getMaxStreak(winDates: string[]): number {
	if (!winDates.length) return 0

	let highestStreak = BASE_STREAK_COUNT
	let workingStreakCount = BASE_STREAK_COUNT
	winDates.forEach((d) => {
		const tomorrow = dayjs(d).add(1, 'day').format('YYYY-MM-DD')
		if (winDates.includes(tomorrow)) {
			workingStreakCount++
		} else {
			if (workingStreakCount > highestStreak) {
				highestStreak = workingStreakCount
			}
			workingStreakCount = BASE_STREAK_COUNT
		}
	})

	return highestStreak
}

export const findIndexOfFinalGuess = (winRecord: GuessRecord) => {
	let finalGuessIndex = 0
	for (let i = 0; i < Object.keys(winRecord).length; i++) {
		if (winRecord[(i + 1) as keyof GuessRecord]) {
			finalGuessIndex++
		}
	}
	return finalGuessIndex
}

export function getGuessDistribution(wins: GameRecord['wins']) {
	const winDistribution: Record<number, number> = {
		0: 0,
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
	}
	if (!Object.keys(wins).length) return winDistribution

	Object.keys(wins).forEach((w) => {
		const guessIndex = findIndexOfFinalGuess(wins[w])
		winDistribution[guessIndex] += 1
	})

	return winDistribution
}
