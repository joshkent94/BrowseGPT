import { FC } from 'react'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import MenuIcon from '@mui/icons-material/Menu'
import Icon from '@mui/material/Icon'
import logo from '@public/icon-dark.png'
import ProfileDropdown from '@components/layout/profileDropdown'

type ChatHeaderProps = {
    open: boolean
    setOpen: (open: boolean) => void
}

const ChatHeader: FC<ChatHeaderProps> = ({ open, setOpen }) => {
    const handleLogoClick = () => {
        setOpen(!open)
    }

    // show burger menu icon on hover
    const showMenu = () => {
        document.getElementById('logo-icon')?.classList.add('hide-logo')
        document
            .getElementById('chat-list-toggle')
            ?.classList.add('show-menu-icon')
    }

    // show logo again when mouse leaves
    const showLogo = () => {
        document.getElementById('logo-icon')?.classList.remove('hide-logo')
        document
            .getElementById('chat-list-toggle')
            ?.classList.remove('show-menu-icon')
    }

    return (
        <AppBar position="static" className="z-20 bg-light-blue shadow-none">
            <Container
                sx={{
                    padding: '12px 12px 0 12px !important',
                    maxWidth: 'calc(100% * 5/6) !important',
                }}
            >
                <Toolbar
                    disableGutters
                    sx={{
                        justifyContent: 'space-between',
                        minHeight: '56px !important',
                    }}
                >
                    <div
                        onClick={handleLogoClick}
                        onMouseEnter={showMenu}
                        onMouseLeave={showLogo}
                        className="relative cursor-pointer hover:opacity-80"
                    >
                        <img
                            src={logo}
                            alt="BrowseGPT logo"
                            height={40}
                            id="logo-icon"
                            className="h-10 w-10 transition-opacity duration-300 ease-in-out"
                        />
                        <Icon
                            component={MenuIcon}
                            id="chat-list-toggle"
                            fontSize="large"
                            className="absolute top-0 h-10 w-10 text-dark-blue opacity-0 transition-opacity duration-300 ease-in-out"
                        />
                    </div>
                    <ProfileDropdown />
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default ChatHeader
