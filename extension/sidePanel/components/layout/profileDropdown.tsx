import {
    Avatar,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    MenuList,
} from '@mui/material'
import { FC, MouseEvent, useEffect, useState } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import HelpIcon from '@mui/icons-material/Help'
import { getInitials } from '@utils/user/getInitials'
import { useGptStore, resetStore } from '@utils/store'
import { useNavigate } from 'react-router-dom'
import { trpc } from '@utils/trpc'

declare global {
    interface Window {
        pendo: any
    }
}

const ProfileDropdown: FC = () => {
    const [userInitials, setUserInitials] = useState<string>('')
    const [anchor, setAnchor] = useState<null | HTMLElement>(null)
    const { user, setIsLoggingOut } = useGptStore()
    const { firstName, lastName } = user
    const open = Boolean(anchor)
    const navigate = useNavigate()

    const clearStorageAndLogout = () => {
        resetStore()
        useGptStore.persist.clearStorage()
        setIsLoggingOut(false)
        window.pendo?.clearSession()
        navigate('/login')
    }

    const sendLogoutMutation = trpc.logout.useMutation({
        onSettled: () => clearStorageAndLogout(),
    })

    const showMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchor(event.currentTarget)
    }

    const hideMenu = () => {
        setAnchor(null)
    }

    useEffect(() => {
        setUserInitials(getInitials([firstName, lastName]))
    }, [firstName, lastName])

    useEffect(() => {
        window.addEventListener('resize', hideMenu)

        return () => {
            window.removeEventListener('resize', hideMenu)
        }
    })

    return (
        <>
            <IconButton
                onClick={showMenu}
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
                        width: 40,
                        height: 40,
                        fontSize: '16px',
                        fontWeight: 500,
                    }}
                    className="text-light-blue"
                >
                    {userInitials}
                </Avatar>
            </IconButton>
            <Menu
                anchorEl={anchor}
                open={open}
                onClose={hideMenu}
                slotProps={{
                    paper: {
                        sx: {
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1,
                            '& .MuiList-root': {
                                p: 0,
                            },
                            '& .MuiMenuItem-root': {
                                py: 1.5,
                                px: 2.5,
                                fontSize: '14px',
                                color: 'text.primary',
                            },
                            '& .MuiMenuItem-root:hover': {
                                backgroundColor:
                                    'rgb(230, 239, 255, 0.7) !important',
                            },
                            '& .MuiListItemIcon-root': {
                                minWidth: '28px !important',
                            },
                            '& .MuiSvgIcon-root': {
                                fontSize: '21px',
                                color: 'text.primary',
                                marginRight: '12px',
                            },
                        },
                        elevation: 0,
                    },
                }}
                transformOrigin={{
                    horizontal: 'right',
                    vertical: 'top',
                }}
                anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'bottom',
                }}
            >
                <MenuList dense>
                    <MenuItem
                        onClick={() => {
                            hideMenu()
                            navigate('/profile')
                        }}
                    >
                        <ListItemIcon>
                            <AccountCircleIcon />
                        </ListItemIcon>
                        Profile
                    </MenuItem>
                    <MenuItem
                        id="launch-resource-center"
                        onClick={() => {
                            hideMenu()
                            window.pendo?.showGuideById(
                                'VuRQStkruo86VokMj404FsKJxbA'
                            )
                        }}
                    >
                        <ListItemIcon>
                            <HelpIcon />
                        </ListItemIcon>
                        Resources
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            hideMenu()
                            setIsLoggingOut(true)
                            sendLogoutMutation.mutate()
                        }}
                    >
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    )
}

export default ProfileDropdown
