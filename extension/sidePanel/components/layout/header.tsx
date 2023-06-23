import { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDetailsFromStorage } from '@utils/getDetailsFromStorage'
import logo from '@public/icon.png'
import MenuIcon from '@mui/icons-material/Menu'
import Icon from '@mui/material/Icon'

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
            <AppBar position="static" className="z-20 border-b border-b-two">
                <Container
                    maxWidth="xl"
                    sx={{
                        padding: '0 16px !important',
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
                                className="absolute top-0 h-9 w-auto text-three opacity-0 transition-opacity duration-300 ease-in-out"
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
                                        backgroundColor: '#d7f9ff',
                                        color: '#0e1c36',
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
            <AppBar position="static" className="z-10 border-b border-b-two">
                <Container maxWidth="xl">
                    <Toolbar
                        disableGutters
                        sx={{
                            justifyContent: 'space-between',
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
