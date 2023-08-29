import { FC } from 'react'
import { createRoot } from 'react-dom/client'
import Heading from '@components/heading'
import Location from '@components/location'
import Commands from '@components/commands'
import CurrentSite from '@components/current-site'
import MainInfo from '@components/info'
import Footer from '@components/footer'
import '@styles/globals.css'
import 'animate.css'

const App: FC = () => {
    return (
        <>
            <Heading />
            <div id="main-content">
                <MainInfo />
                <Location />
                <CurrentSite />
                <Commands />
            </div>
            <Footer />
        </>
    )
}

const init = () => {
    const appContainer = document.createElement('div')
    document.body.appendChild(appContainer)
    const root = createRoot(appContainer)
    root.render(<App />)
}

init()
