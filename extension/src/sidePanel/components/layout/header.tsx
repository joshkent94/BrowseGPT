import React, { useEffect, useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import { Link, useNavigate } from 'react-router-dom'
import { getDetailsFromStorage } from '@utils/getDetailsFromStorage'
import logo from '@static/logo.png'

const Header = () => {
    const navigate = useNavigate()
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

    if (userInitials) {
        return (
            <AppBar position="static" className="z-10 border-b border-b-two">
                <Container maxWidth="xl">
                    <Toolbar
                        disableGutters
                        sx={{
                            justifyContent: 'space-between',
                        }}
                    >
                        <Link to={'/'} className="hover:opacity-80">
                            <img src={logo} alt="BrowseGPT logo" width={120} />
                        </Link>
                        <Box sx={{ flexGrow: 0 }}>
                            <IconButton
                                onClick={() => navigate('/details')}
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
                        <img src={logo} alt="BrowseGPT logo" width={120} />
                    </Toolbar>
                </Container>
            </AppBar>
        )
    }
}

export default Header
