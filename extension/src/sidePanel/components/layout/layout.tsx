import { Outlet } from 'react-router-dom'
import Header from './header'
import React from 'react'
import Footer from './footer'

const Layout = () => {
    return (
        <div className="flex h-screen max-h-screen w-full flex-col overflow-hidden">
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout
