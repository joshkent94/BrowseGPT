import FavoriteIcon from '@mui/icons-material/Favorite'

const Footer = () => {
    return (
        <div className="z-20 flex h-14 min-h-[56px] w-full items-center justify-center border-t border-t-two bg-one text-sm text-three">
            Made with <FavoriteIcon className="mx-1" fontSize="small" /> by
            BrowseGPT Ltd.
        </div>
    )
}

export default Footer
