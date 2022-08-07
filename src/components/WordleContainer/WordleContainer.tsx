// external
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import Modal from 'react-modal'
import { toast } from 'react-toastify'

// types/interfaces
import { GameRecord, GuessRecord } from '../../interfaces'

// components
import { Keyboard } from '../Keyboard/Keyboard'
import { LetterRow } from '../LetterRow/LetterRow'
import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator'

// hooks/queries
import { useLocalStorageState } from '../../hooks'
import { useTodaysWord, useValidWordDictionary } from '../../queries'

// styles
import { StatsPanel } from '../StatsPanel/StatsPanel'
import styles from './WordleContainer.module.css'

const modalStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
}

const today = dayjs().format('YYYY-MM-DD')

export const WordleContainer: React.FC<{}> = () => {
	const { status: todaysWordStatus, data: todaysWord } = useTodaysWord()
	const { status: dictionaryStatus, data: validWordDictionary } =
		useValidWordDictionary()

	const [guesses, setGuesses] = useLocalStorageState<GuessRecord>(
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
	const [guessIndex, setGuessIndex] = useState<keyof GuessRecord>(() => {
		let startingIndex: keyof GuessRecord = 0
		for (let i = 0; i < 6; i++) {
			if (guesses[i as keyof GuessRecord].length) {
				startingIndex++
			}
		}
		return startingIndex as keyof GuessRecord
	})
	const [currentGuess, setCurrentGuess] = useState(guesses[guessIndex])
	const [gameRecord, setGameRecord] = useLocalStorageState<GameRecord>(
		{
			losses: {},
			wins: {},
		},
		'gameRecord'
	)
	const gameRecordKeys = Object.keys(gameRecord.losses).concat(
		Object.keys(gameRecord.wins)
	)
	const [isModalOpen, setIsModalOpen] = useState(
		gameRecordKeys.includes(today) || false
	)
	const [hasFinished, setHasFinished] = useState(
		gameRecordKeys.includes(today) || false
	)

	const loseTheGame = useCallback(() => {
		setHasFinished(true)
		toast.warning("Sorry! You didn't guess the correct word.")
		setGameRecord({
			...gameRecord,
			losses: {
				...gameRecord.losses,
				[today]: {
					...guesses,
					[guessIndex]: currentGuess,
				},
			},
		})
		setGuessIndex((guessIndex + 1) as keyof GuessRecord)
		setIsModalOpen(true)
	}, [currentGuess, gameRecord, guessIndex, guesses, setGameRecord])

	const makeAGuess = useCallback(() => {
		setGuesses({
			...guesses,
			[guessIndex]: currentGuess,
		})
		if (guessIndex < 5) {
			setGuessIndex((guessIndex + 1) as keyof GuessRecord)
			setCurrentGuess('')
		} else {
			loseTheGame()
		}
	}, [currentGuess, guessIndex, guesses, loseTheGame, setGuesses])

	const winTheGame = useCallback(() => {
		const toastId = toast.success('You got the word!')
		makeAGuess()
		setGameRecord({
			...gameRecord,
			wins: {
				...gameRecord.wins,
				[today]: {
					...guesses,
					[guessIndex]: currentGuess,
				},
			},
		})
		setHasFinished(true)
		toast.onChange((v) => {
			// workaround for React 18 strict mode
			// onClose uses useEffect which runs twice
			if (v.id === toastId && v.status === 'removed') {
				setIsModalOpen(true)
			}
		})
	}, [currentGuess, gameRecord, guessIndex, guesses, makeAGuess, setGameRecord])

	const onSubmit = useCallback(() => {
		if (currentGuess.length < 5) {
			toast.warning('Not enough letters!')
		} else {
			if (currentGuess === todaysWord) {
				winTheGame()
			} else if (!validWordDictionary?.includes(currentGuess)) {
				toast.warning('Not a valid word', {
					onClose: () => setCurrentGuess(''),
				})
			} else {
				makeAGuess()
			}
		}
	}, [currentGuess, winTheGame, makeAGuess, todaysWord, validWordDictionary])

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
					value={
						isCurrentGuess ? currentGuess : guesses[i as keyof GuessRecord]
					}
				/>
			)
		})
	}

	Modal.setAppElement('#root')

	return (
		<>
			{todaysWordStatus === 'loading' || dictionaryStatus === 'loading' ? (
				<LoadingIndicator />
			) : (
				<div>
					<div className={styles.title}>Wordle Clone</div>
					<div className={styles.tileMap}>{renderRows()}</div>
					<Keyboard guesses={guesses} onClick={onKeypress} />
				</div>
			)}
			<Modal closeTimeoutMS={200} isOpen={isModalOpen} style={modalStyles}>
				<div className={styles.modalContent}>
					<div
						className={styles.closeButton}
						onClick={() => setIsModalOpen(false)}
					>
						X
					</div>
					<StatsPanel gameRecord={gameRecord} />
				</div>
			</Modal>
		</>
	)
}
