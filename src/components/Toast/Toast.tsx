export interface ToastProps {
	message: string
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
	return <div>{message}</div>
}
