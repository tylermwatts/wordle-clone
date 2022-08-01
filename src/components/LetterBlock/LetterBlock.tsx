// external
import cx from 'classnames'

// styles
import styles from './LetterBlock.module.css'

export interface LetterBlockProps {
	indicatedClue?: 'correct' | 'incorrect' | 'included'
	isKeyboardLetter?: boolean
	letter: string | undefined
}

export const LetterBlock: React.FC<LetterBlockProps> = ({
	indicatedClue,
	isKeyboardLetter,
	letter,
}) => {
	return (
		<div
			className={cx(
				styles.letterBlock,
				indicatedClue && styles[indicatedClue],
				isKeyboardLetter && styles.keyboardLetter
			)}
		>
			{letter?.toUpperCase()}
		</div>
	)
}
