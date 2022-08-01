import styles from './App.module.css'
import { WordleContainer } from './components/WordleContainer/WordleContainer'

function App() {
	return (
		<div className={styles.app}>
			<WordleContainer />
		</div>
	)
}

export default App
