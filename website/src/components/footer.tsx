import FavoriteIcon from '@mui/icons-material/Favorite'
import CopyrightIcon from '@mui/icons-material/Copyright'
import { FC } from 'react'

const Footer: FC = () => {
    return (
        <div className="flex justify-center py-8">
            <div className="text-xs sm:text-sm inline-flex items-center">
                Made with <FavoriteIcon className="mx-1 text-sm" /> by BrowseGPT
                Ltd. <CopyrightIcon className="mx-1 text-sm" /> All rights
                reserved.
            </div>
        </div>
    )
}

export default Footer
