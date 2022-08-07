// external
import cx from 'classnames'
import dayjs from 'dayjs'

// types/interfaces
import { GameRecord } from '../../interfaces'

// utils
import { getCurrentStreak, getMaxStreak } from './../../utils'

// styles
import {
	findIndexOfFinalGuess,
	getGuessDistribution,
} from './../../utils/index'
import styles from './StatsPanel.module.css'

export interface StatsPanelProps {
	gameRecord: GameRecord
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ gameRecord }) => {
	const today = dayjs().format('YYYY-MM-DD')
	const wins = Object.keys(gameRecord.wins)
	const played = wins.length + Object.keys(gameRecord.losses).length
	const winPercent = Math.ceil((wins.length / played) * 100)
	const currentStreak = getCurrentStreak(wins)
	const maxStreak = getMaxStreak(wins)
	const guessDistribution = getGuessDistribution(gameRecord.wins)

	return (
		<div className={styles.recordContainer}>
			<header className={styles.sectionHeader}>Statistics</header>
			<div className={styles.statistics}>
				<StatWithLabel labelText='Played' stat={played} />
				<StatWithLabel labelText='Win %' stat={winPercent} />
				<StatWithLabel labelText='Current Streak' stat={currentStreak} />
				<StatWithLabel labelText='Max Streak' stat={maxStreak} />
			</div>
			<header className={styles.sectionHeader}>Guess Distribution</header>
			<div className={styles.distribution}>
				{Object.keys(guessDistribution).map((guessIndex) => {
					const barLength = Math.ceil(
						(guessDistribution[guessIndex as unknown as number] / wins.length) *
							100
					)
					return (
						<GuessDistributionRow
							key={`guess-row-${guessIndex}`}
							barLength={barLength}
							guessIndex={Number(guessIndex)}
							isTodaysGuess={
								Number(guessIndex) ===
								findIndexOfFinalGuess(gameRecord.wins[today])
							}
							numberOfGuesses={
								guessDistribution[guessIndex as unknown as number]
							}
						/>
					)
				})}
			</div>
		</div>
	)
}

interface StatWithLabelProps {
	labelText: string
	stat: number
}

function StatWithLabel({ labelText, stat }: StatWithLabelProps) {
	return (
		<div className={styles.statBox}>
			<div className={styles.stat}>{stat}</div>
			<div className={styles.statLabel}>{labelText}</div>
		</div>
	)
}

interface GuestDistributionRowProps {
	barLength: number
	guessIndex: number
	isTodaysGuess: boolean
	numberOfGuesses: number
}

function GuessDistributionRow({
	barLength,
	guessIndex,
	isTodaysGuess,
	numberOfGuesses,
}: GuestDistributionRowProps) {
	const displayNumber = Number(guessIndex) + 1
	return (
		<div className={styles.guessDistributionRow}>
			<div>{displayNumber}</div>
			<div
				className={cx(styles.guessBar, isTodaysGuess && styles.isTodaysGuess)}
				style={{ width: `${barLength}%` }}
			>
				{numberOfGuesses}
			</div>
		</div>
	)
}
