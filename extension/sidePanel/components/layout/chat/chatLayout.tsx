import { FC, useState } from 'react'
import { Outlet } from 'react-router-dom'
import ChatHeader from '@components/layout/chat/chatHeader'
import Footer from '@components/layout/footer'
import ChatList from '@components/chat/chatList'

const ChatLayout: FC = () => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <div className="flex h-screen max-h-screen w-full flex-col overflow-hidden">
            <ChatHeader open={open} setOpen={setOpen} />
            <ChatList open={open} setOpen={setOpen} />
            <Outlet />
            <Footer />
        </div>
    )
}

export default ChatLayout
