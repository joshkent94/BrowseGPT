import React from 'react'
import { createRoot } from 'react-dom/client'
import '@assets/globals.css'
import SidePanel from '@components/sidePanel'

const init = () => {
    const appContainer = document.createElement('div')
    document.body.appendChild(appContainer)
    if (!appContainer) {
        throw new Error('Cannot find app container')
    }
    const root = createRoot(appContainer)
    root.render(<SidePanel />)
}

init()
