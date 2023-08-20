import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import logo from '@public/icon.png'
import ProfileDropdown from '@shared/components/layout/profileDropdown'
import { useGptStore } from '@shared/utils/store'

const DetailsHeader: FC = () => {
    const navigate = useNavigate()
    const { user } = useGptStore()
    const { firstName } = user
    const hasEnteredDetails = firstName

    const handleLogoClick = () => {
        navigate('/')
    }

    if (!hasEnteredDetails) {
        return (
            <AppBar
                position="static"
                className="z-20 bg-light-blue shadow-none"
            >
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
                        <div className="relative">
                            <img
                                src={logo}
                                alt="BrowseGPT logo"
                                height={40}
                                id="logo-icon"
                                className="h-10 w-10"
                            />
                        </div>
                    </Toolbar>
                </Container>
            </AppBar>
        )
    } else {
        return (
            <AppBar
                position="static"
                className="z-20 bg-light-blue shadow-none"
            >
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
                            className="relative cursor-pointer hover:opacity-80"
                        >
                            <img
                                src={logo}
                                alt="BrowseGPT logo"
                                height={40}
                                id="logo-icon"
                                className="h-10 w-10 transition-opacity duration-300 ease-in-out"
                            />
                        </div>
                        <ProfileDropdown />
                    </Toolbar>
                </Container>
            </AppBar>
        )
    }
}

export default DetailsHeader
