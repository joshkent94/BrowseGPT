import { FC } from 'react'
import { Slide, ToastContainer } from 'react-toastify'

const Toast: FC = () => {
    return (
        <ToastContainer
            autoClose={2000}
            hideProgressBar
            draggable={false}
            closeButton={false}
            limit={1}
            transition={Slide}
            pauseOnFocusLoss={false}
            className="w-72 font-medium text-midnight-blue"
            bodyClassName="p-3"
        />
    )
}

export default Toast
