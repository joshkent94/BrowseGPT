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
    const [userInitials, setUserInitials] = useState('JS')

    useEffect(() => {
        getDetailsFromStorage().then(({ firstName, lastName, userAPIKey }) => {
            if (!firstName || !lastName || !userAPIKey) {
                navigate('/details')
            } else {
                const initials = [firstName, lastName].map((name: string) => {
                    return name.charAt(0).toUpperCase()
                })
                setUserInitials(initials.join(''))
            }
        })
    }, [])

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar
                    disableGutters
                    sx={{ justifyContent: 'space-between' }}
                >
                    <Link to={'/'} className='hover:opacity-80'>
                        <img
                            src={logo}
                            alt="BrowseGPT logo"
                            width={140}
                            height={40}
                        />
                    </Link>
                    <Box sx={{ flexGrow: 0 }}>
                        <IconButton
                            onClick={() => navigate('/details')}
                            sx={{
                                p: 0,
                                '&:hover': {
                                    opacity: 0.8
                                }
                            }}
                        >
                            <Avatar
                                sx={{
                                    backgroundColor: '#f9fbf2',
                                    color: '#0e1c36'
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
}

export default Header
