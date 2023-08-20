import { FC, useState } from 'react'
import { Outlet } from 'react-router-dom'
import ChatHeader from '@shared/components/layout/chat/chatHeader'
import Footer from '@shared/components/layout/footer'
import ChatList from '@shared/components/chat/chatList'

const ChatLayout: FC = () => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <div className="flex h-screen max-h-screen w-full flex-col overflow-hidden">
            <ChatHeader open={open} setOpen={setOpen} />
            <ChatList open={open} setOpen={setOpen} />
            <Outlet context={open} />
            <Footer />
        </div>
    )
}

export default ChatLayout
