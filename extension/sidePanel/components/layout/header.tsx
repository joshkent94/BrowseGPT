import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import { getDetailsFromStorage } from '@utils/getDetailsFromStorage'
import MenuIcon from '@mui/icons-material/Menu'
import Icon from '@mui/material/Icon'
import logo from '@public/icon-dark.png'

const Header = ({ open, setOpen }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [userInitials, setUserInitials] = useState(null)

    useEffect(() => {
        getDetailsFromStorage().then(({ firstName, lastName }) => {
            if (firstName && lastName) {
                const initials = [firstName, lastName].map((name: string) => {
                    return name.charAt(0).toUpperCase()
                })
                setUserInitials(initials.join(''))
            }
        })
    })

    const handleLogoClick = () => {
        if (location.pathname !== '/') {
            navigate('/')
        } else {
            setOpen(!open)
        }
    }

    // show burger menu icon on hover
    const showMenu = () => {
        if (location.pathname === '/') {
            document.getElementById('logo-icon')?.classList.add('hide-logo')
            document
                .getElementById('chat-list-toggle')
                ?.classList.add('show-menu-icon')
        }
    }

    // show logo again when mouse leaves
    const showLogo = () => {
        if (location.pathname === '/') {
            document.getElementById('logo-icon')?.classList.remove('hide-logo')
            document
                .getElementById('chat-list-toggle')
                ?.classList.remove('show-menu-icon')
        }
    }

    if (userInitials) {
        return (
            <AppBar
                position="static"
                className="z-20 bg-light-blue shadow-none"
            >
                <Container
                    sx={{
                        padding: '10px 16px 0 16px !important',
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
                                className="h-9 transition-opacity duration-300 ease-in-out"
                            />
                            <Icon
                                component={MenuIcon}
                                id="chat-list-toggle"
                                fontSize="large"
                                className="absolute top-0 h-9 w-auto text-dark-blue opacity-0 transition-opacity duration-300 ease-in-out"
                            />
                        </div>
                        <Box sx={{ flexGrow: 0 }}>
                            <IconButton
                                onClick={() => !open && navigate('/details')}
                                sx={{
                                    p: 0,
                                    '&:hover': {
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                <Avatar
                                    sx={{
                                        backgroundColor: 'primary.main',
                                        color: 'text.secondary',
                                        width: 36,
                                        height: 36,
                                        fontSize: '16px',
                                        fontWeight: 500,
                                    }}
                                >
                                    {userInitials}
                                </Avatar>
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        )
    } else {
        return (
            <AppBar
                position="static"
                className="z-10 bg-light-blue shadow-none"
            >
                <Container
                    sx={{
                        padding: '10px 16px 0 16px !important',
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
                        <img
                            src={logo}
                            alt="BrowseGPT logo"
                            height={40}
                            className="h-9"
                        />
                    </Toolbar>
                </Container>
            </AppBar>
        )
    }
}

export default Header
