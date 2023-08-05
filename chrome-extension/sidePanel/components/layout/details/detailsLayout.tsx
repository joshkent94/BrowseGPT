import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '@components/layout/footer'
import DetailsHeader from '@components/layout/details/detailsHeader'

const DetailsLayout: FC = () => {
    return (
        <div className="flex h-screen max-h-screen w-full flex-col overflow-hidden">
            <DetailsHeader />
            <Outlet />
            <Footer />
        </div>
    )
}

export default DetailsLayout
