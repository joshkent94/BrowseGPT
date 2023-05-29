import { Outlet } from 'react-router-dom'
import Header from './header'
import React from 'react'

const Layout = () => {
    return (
        <div className="flex h-full w-full flex-col">
            <Header />
            <Outlet />
        </div>
    )
}

export default Layout
