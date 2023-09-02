import { useState, useRef, useEffect, FC } from 'react'
import currentSite from '@public/current-site.png'

const CurrentSite: FC = () => {
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
            <img
                src={currentSite}
                alt="Current site screenshot"
                className="h-[250px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-lg"
            />
            <div className="text-base sm:text-2xl ml-6 sm:ml-12 lg:ml-28 text-center font-medium">
                Get help when you need it, on the site you need it
            </div>
        </div>
    )
}

export default CurrentSite
