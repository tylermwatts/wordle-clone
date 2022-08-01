// external
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'

// components
import { Keyboard } from '../Keyboard/Keyboard'
import { LetterRow } from '../LetterRow/LetterRow'
import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator'

// hooks/queries
import { useLocalStorageState } from '../../hooks'
import { useTodaysWord, useValidWordDictionary } from '../../queries'

// styles
import styles from './WordleContainer.module.css'

const today = dayjs().format('YYYY-MM-DD')

export const WordleContainer: React.FC<{}> = () => {
	const { status: todaysWordStatus, data: todaysWord } = useTodaysWord()
	const { status: dictionaryStatus, data: validWordDictionary } =
		useValidWordDictionary()

	const [hasFinished, setHasFinished] = useState(false)
	const [guesses, setGuesses] = useLocalStorageState<Record<number, string>>(
		{
			0: '',
			1: '',
			2: '',
			3: '',
			4: '',
			5: '',
		},
		`${today}-guesses`
	)
	const [guessIndex, setGuessIndex] = useState(() => {
		let startingIndex = 0
		for (let i = 0; i < 6; i++) {
			if (guesses[i].length) {
				startingIndex++
			}
		}
		return startingIndex
	})
	const [currentGuess, setCurrentGuess] = useState(guesses[guessIndex])

	const makeAGuess = useCallback(() => {
		setGuesses({
			...guesses,
			[guessIndex]: currentGuess,
		})
		setGuessIndex(guessIndex + 1)
		setCurrentGuess('')
	}, [currentGuess, guessIndex, guesses, setGuesses])

	const endTheGame = useCallback(() => {
		makeAGuess()
		setHasFinished(true)
		// setGameRecord(guesses)
	}, [makeAGuess])

	const onSubmit = useCallback(() => {
		if (currentGuess.length < 5) {
			window.alert('Not enough letters!')
		} else {
			if (currentGuess === todaysWord) {
				// you win
				endTheGame()
				window.alert('You win')
			} else if (!validWordDictionary?.includes(currentGuess)) {
				window.alert('not a valid word')
				setGuesses({
					...guesses,
					[guessIndex]: '',
				})
			} else {
				makeAGuess()
			}
		}
	}, [
		currentGuess,
		endTheGame,
		guessIndex,
		guesses,
		makeAGuess,
		setGuesses,
		todaysWord,
		validWordDictionary,
	])

	const onKeypress = useCallback(
		(key: string) => {
			if (hasFinished) return
			if (key === 'Enter' || key === 'Return' || key === '\u23CE') {
				onSubmit()
				return
			}

			if ((key === 'Backspace' || key === '\u232b') && currentGuess.length) {
				setCurrentGuess(currentGuess.slice(0, -1))
				return
			}

			const validLetter = key.match(/[a-z]/gi)
			if (!validLetter || key.length > 1) {
				return
			} else if (currentGuess.length < 5) {
				const updatedValue = currentGuess + key
				setCurrentGuess(updatedValue)
			}
		},
		[currentGuess, hasFinished, onSubmit]
	)

	useEffect(() => {
		const keyupListener = (e: KeyboardEvent) => {
			if (hasFinished) return
			const key = String(e.key)

			onKeypress(key)
		}
		document.addEventListener('keyup', keyupListener)

		return () => document.removeEventListener('keyup', keyupListener)
	}, [guessIndex, guesses, onKeypress, onSubmit, hasFinished])

	const renderRows = () => {
		return Array.from({ length: 6 }).map((_, i) => {
			const isCurrentGuess = i === guessIndex
			return (
				<LetterRow
					key={`row-${i}`}
					isCurrentGuess={isCurrentGuess}
					value={isCurrentGuess ? currentGuess : guesses[i]}
				/>
			)
		})
	}

	return todaysWordStatus === 'loading' || dictionaryStatus === 'loading' ? (
		<LoadingIndicator />
	) : (
		<div>
			<div className={styles.title}>Wordle Clone</div>
			<div className={styles.tileMap}>{renderRows()}</div>
			<Keyboard guesses={guesses} onClick={onKeypress} />
		</div>
	)
}
