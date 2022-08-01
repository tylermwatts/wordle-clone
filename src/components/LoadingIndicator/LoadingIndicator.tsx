// styles
import styles from './LoadingIndicator.module.css'

export const LoadingIndicator: React.FC<{}> = () => {
	return (
		<div className={styles.loadingContainer}>
			<div className={styles.loadingText}>Fetching today's word</div>
			<div className={styles['lds-ellipsis']}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	)
}
