// components
import { LetterBlock, LetterBlockProps } from '../LetterBlock/LetterBlock'

// hooks/queries
import { useTodaysWord } from '../../queries'

// styles
import styles from './Keyboard.module.css'

export interface KeyboardProps {
	guesses: Record<number, string>
	onClick: (letterKey: string) => void
}

export const Keyboard: React.FC<KeyboardProps> = ({ guesses, onClick }) => {
	const { data: todaysWord } = useTodaysWord()

	const rowOne = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
	const rowTwo = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
	const rowThree = ['\u23CE', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '\u232b']

	const getIndicatorForLetter = (
		letter: string
	): LetterBlockProps['indicatedClue'] => {
		let indicator: LetterBlockProps['indicatedClue'] = undefined
		const guessedLetters = Object.values(guesses).join('')
		if (guessedLetters.includes(letter)) {
			if (todaysWord?.includes(letter)) {
				const occurrencesOfLetter = todaysWord
					.split('')
					.reduce<number[]>((acc, curr, ind) => {
						if (letter === curr) {
							acc.push(ind)
						}
						return acc
					}, [])
				for (const key in guesses) {
					const currentGuess = guesses[key]
					if (occurrencesOfLetter.includes(currentGuess.indexOf(letter))) {
						indicator = 'correct'
					}
				}

				if (indicator !== 'correct') {
					indicator = 'included'
				}
			} else {
				indicator = 'incorrect'
			}
		}
		return indicator
	}

	const renderRow = (row: string[]) => {
		return (
			<div className={styles.keyboardRow}>
				{row.map((letterKey) => {
					const indicator = getIndicatorForLetter(letterKey)
					return (
						<div
							key={`keyboard-key-${letterKey}`}
							onClick={() => onClick(letterKey)}
						>
							<LetterBlock
								indicatedClue={indicator}
								letter={letterKey}
								isKeyboardLetter
							/>
						</div>
					)
				})}
			</div>
		)
	}

	return (
		<div className={styles.keyboard}>
			{renderRow(rowOne)}
			{renderRow(rowTwo)}
			{renderRow(rowThree)}
		</div>
	)
}
