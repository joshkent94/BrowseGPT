import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@components/layout/header'
import Footer from '@components/layout/footer'
import ChatList from '@components/layout/chatList'

const Layout = ({ setOpenChat, setChats }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="flex h-screen max-h-screen w-full flex-col overflow-hidden">
            <Header open={open} setOpen={setOpen} />
            <ChatList
                open={open}
                setOpen={setOpen}
                setChats={setChats}
                setOpenChat={setOpenChat}
            />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout
