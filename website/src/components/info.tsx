import { useState, useRef, useEffect, FC } from 'react'
import { Button } from '@mui/material'

const Info: FC = () => {
    const [isVisible, setVisible] = useState(false)
    const domRef = useRef()

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setVisible(true)
                observer.unobserve(domRef.current)
            }
        })

        observer.observe(domRef.current)

        return () => observer.unobserve(domRef.current)
    }, [])

    return (
        <div
            ref={domRef}
            className={
                isVisible
                    ? 'flex flex-col items-center justify-between px-16 md:px-32 animate__animated animate__slow animate__fadeIn'
                    : 'flex flex-col items-center justify-between px-16 md:px-32 animate__animated animate__slow'
            }
            id="info"
        >
            <h2 className="text-xl sm:text-3xl text-center font-medium">
                An AI assistant that persists across tabs and browsers.
            </h2>
            <h2 className="text-xl sm:text-3xl text-center font-medium">
                Toggle it into view with a keyboard shortcut so it's never in
                the way.
            </h2>
            <div className="flex gap-4 sm:gap-8 md:gap-14 justify-center my-28 md:mb-56">
                <Button
                    variant="outlined"
                    color="primary"
                    className="w-36 sm:w-48 md:w-56 h-9 md:h-12 bg-dark-blue border-dark-blue hover:opacity-80 p-0"
                    sx={{ textTransform: 'none' }}
                >
                    <a
                        href="https://chrome.google.com/webstore/detail/browsegpt/ijdehllahgkhhcoffcohgmbebcchdknb"
                        target="_blank"
                        title="Chrome Download"
                        className="h-full w-full text-white p-2 flex justify-center items-center text-sm sm:text-base md:text-lg"
                    >
                        Add to Chrome
                    </a>
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    className="w-36 sm:w-48 md:w-56 h-9 md:h-12 bg-dark-blue border-dark-blue hover:opacity-80 p-0"
                    sx={{ textTransform: 'none' }}
                >
                    <a
                        href="https://addons.mozilla.org/en-US/firefox/addon/browsegpt/"
                        target="_blank"
                        title="Firefox Download"
                        className="h-full w-full text-white p-2 flex justify-center items-center text-sm sm:text-base md:text-lg"
                    >
                        Add to Firefox
                    </a>
                </Button>
            </div>
        </div>
    )
}

export default Info
