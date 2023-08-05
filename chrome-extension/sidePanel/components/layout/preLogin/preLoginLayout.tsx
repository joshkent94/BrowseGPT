import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '@components/layout/footer'
import PreLoginHeader from '@components/layout/preLogin/preLoginHeader'

const PreLoginLayout: FC = () => {
    return (
        <div className="flex h-screen max-h-screen w-full flex-col overflow-hidden">
            <PreLoginHeader />
            <Outlet />
            <Footer />
        </div>
    )
}

export default PreLoginLayout
