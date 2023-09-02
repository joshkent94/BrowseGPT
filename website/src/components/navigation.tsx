import { FC } from 'react'
import logo from '@public/logo.png'
import GitHubIcon from '@mui/icons-material/GitHub'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'

const Navigation: FC = () => {
    return (
        <AppBar
            position="static"
            className="z-20 shadow-none fixed top-0 !bg-transparent"
            id="nav"
            sx={{
                backgroundColor: 'unset',
            }}
        >
            <Container
                sx={{
                    padding: '12px 0 !important',
                    maxWidth: 'calc(100% * 9/10) !important',
                }}
            >
                <Toolbar
                    disableGutters
                    sx={{
                        justifyContent: 'space-between',
                        minHeight: '56px !important',
                    }}
                >
                    <a href="/" className="hover:opacity-70">
                        <img src={logo} alt="BrowseGPT logo" className="h-9" />
                    </a>
                    <a
                        href="https://github.com/joshkent94/BrowseGPT"
                        title="GitHub"
                        target="_blank"
                        className="hover:opacity-70"
                    >
                        <GitHubIcon
                            sx={{
                                height: '32px !important',
                                width: '32px !important',
                            }}
                        />
                    </a>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Navigation
