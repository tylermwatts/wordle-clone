// external
import { v4 as uuid } from 'uuid'

// components
import { LetterBlock, LetterBlockProps } from '../LetterBlock/LetterBlock'

// hooks/queries
import { useTodaysWord } from '../../queries'

// styles
import styles from './LetterRow.module.css'

export interface LetterRowProps {
	isCurrentGuess: boolean
	value: string | undefined
}

export const LetterRow: React.FC<LetterRowProps> = ({
	isCurrentGuess,
	value = '',
}) => {
	const { data: todaysWord } = useTodaysWord()

	const getClueValue = (
		indexToCheck: number
	): LetterBlockProps['indicatedClue'] => {
		const letterValue = value[indexToCheck]
		if (letterValue && !isCurrentGuess) {
			if (todaysWord?.includes(letterValue)) {
				if (letterValue === todaysWord[indexToCheck]) {
					return 'correct'
				}

				const occurrencesOfLetter = todaysWord
					.split('')
					.reduce<number[]>((acc, curr, i) => {
						if (curr === value[indexToCheck]) {
							acc.push(i)
						}
						return acc
					}, [])

				if (
					occurrencesOfLetter.length === 1 &&
					value[occurrencesOfLetter[0]] === todaysWord[occurrencesOfLetter[0]]
				) {
					return 'incorrect'
				} else {
					return 'included'
				}
			} else {
				return 'incorrect'
			}
		} else {
			return undefined
		}
	}

	const renderLetterBlocks = () => {
		const blocks = []
		for (let i = 0; i < 5; i++) {
			blocks.push(
				<LetterBlock
					key={uuid()}
					indicatedClue={getClueValue(i)}
					letter={value[i]}
				/>
			)
		}
		return blocks
	}

	return <div className={styles.letterRow}>{renderLetterBlocks()}</div>
}
