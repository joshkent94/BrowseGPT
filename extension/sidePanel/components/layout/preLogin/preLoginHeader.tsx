import { FC } from 'react'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import logo from '@public/icon-dark.png'

const PreLoginHeader: FC = () => {
    return (
        <AppBar position="static" className="z-10 bg-light-blue shadow-none">
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
                    <img
                        src={logo}
                        alt="BrowseGPT logo"
                        height={40}
                        className="h-10 w-10"
                    />
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default PreLoginHeader
