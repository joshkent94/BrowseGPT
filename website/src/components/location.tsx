import { useState, useRef, useEffect, FC } from 'react'
import location from '@public/location.png'

const Location: FC = () => {
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
                    ? 'w-5/6 lg:w-2/3 m-auto flex items-center justify-between my-32 animate__animated animate__slow animate__fadeIn'
                    : 'w-5/6 lg:w-2/3 m-auto flex items-center justify-between my-32 animate__animated animate__slow'
            }
        >
            <div className="text-base sm:text-2xl mr-6 sm:mr-12 lg:mr-28 text-center font-medium">
                Responses are bespoke using your current location
            </div>
            <img
                src={location}
                alt="Location screenshot"
                className="h-[250px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-lg"
            />
        </div>
    )
}

export default Location
