import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './App.module.css'
import { WordleContainer } from './components/WordleContainer/WordleContainer'

function App() {
	return (
		<div className={styles.app}>
			<WordleContainer />
			<ToastContainer
				autoClose={3000}
				position='top-center'
				closeOnClick
				hideProgressBar
				newestOnTop
				pauseOnHover
			/>
		</div>
	)
}

export default App
