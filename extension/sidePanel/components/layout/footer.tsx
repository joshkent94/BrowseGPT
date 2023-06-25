import FavoriteIcon from '@mui/icons-material/Favorite'

const Footer = () => {
    return (
        <div className="z-20 flex h-14 min-h-[56px] w-full justify-center bg-light-blue pt-3 text-sm text-dark-blue">
            Made with <FavoriteIcon className="mx-1" fontSize="small" /> by
            BrowseGPT Ltd.
        </div>
    )
}

export default Footer
