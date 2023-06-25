import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Drawer,
    ListItemIcon,
    TextField,
    InputAdornment,
    Button,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CircleIcon from '@mui/icons-material/Circle'
import SearchIcon from '@mui/icons-material/Search'
import { v4 as uuid } from 'uuid'
import { MouseEvent, useContext, useEffect, useState } from 'react'
import { ChatsArrayContext, OpenChatContext } from '@utils/context'

const ChatList = ({ open, setOpen, setOpenChat, setChats }) => {
    const existingChats = useContext(ChatsArrayContext)
    const openChat = useContext(OpenChatContext)
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredChats, setFilteredChats] = useState(existingChats)

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredChats(existingChats)
        } else {
            const filteredChats = existingChats.filter((chat) => {
                const chatText = chat.messages.map((message) =>
                    message.content.toLowerCase()
                )
                return chatText.some((text) =>
                    text.includes(searchTerm.toLowerCase())
                )
            })
            setFilteredChats(filteredChats)
        }
    }, [searchTerm, existingChats])

    const handleNewChat = () => {
        setOpenChat({ id: uuid(), isOpen: true, messages: [] })
        setOpen(false)
    }

    const handleSetOpenChat = (event: MouseEvent, chat: Chat) => {
        setOpenChat(chat)
        setOpen(false)
    }

    const handleShowDeleteIcon = (event: MouseEvent) => {
        const icons = event.currentTarget.querySelectorAll(
            '.MuiListItemIcon-root'
        )
        const deleteIcon = icons[icons?.length - 1] as HTMLElement
        deleteIcon.style.display = 'block'
    }

    const handleHideDeleteIcon = (event: MouseEvent) => {
        const icons = event.currentTarget.querySelectorAll(
            '.MuiListItemIcon-root'
        )
        const deleteIcon = icons[icons?.length - 1] as HTMLElement
        deleteIcon.style.display = 'none'
    }

    const handleDeleteChat = (event: MouseEvent, chat: Chat) => {
        event.stopPropagation()
        const newChatsArray = existingChats.filter(
            (existingChat) => existingChat.id !== chat.id
        )
        setChats(newChatsArray)
        if (openChat.id === chat.id) {
            if (newChatsArray.length > 0) {
                setOpenChat(newChatsArray[0])
            } else {
                handleNewChat()
            }
        }
    }

    return (
        <Drawer
            open={open}
            onClose={() => setOpen(false)}
            hideBackdrop
            sx={{
                flexShrink: 0,
                position: 'static',
                zIndex: 10,
                '& .MuiDrawer-paper': {
                    width: '100%',
                    boxSizing: 'border-box',
                    backgroundColor: 'rgb(230, 239, 255)',
                    paddingBottom: '56px',
                    boxShadow: 'none',
                },
                '& *': {
                    zIndex: '10 !important',
                },
            }}
        >
            <Toolbar
                disableGutters
                sx={{
                    justifyContent: 'space-between',
                    minHeight: '56px !important',
                }}
            />
            <Box
                sx={{
                    overflow: 'auto',
                    zIndex: 10,
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    padding: '20px 40px',
                    '@media (max-width: 600px)': {
                        padding: '20px 20px',
                    },
                }}
            >
                <TextField
                    label="Search"
                    type="search"
                    value={searchTerm}
                    placeholder="Search..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        m: '16px auto',
                        width: '240px',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                        },
                        '& .MuiInputLabel-outlined': {
                            color: 'text.primary',
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'text.primary',
                        },
                        '& .MuiInputAdornment-positionStart': {
                            color: 'text.primary',
                        },
                    }}
                    color="primary"
                    autoComplete="off"
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
                <List
                    sx={{
                        '& .MuiListItemIcon-root + .MuiListItemText-root': {
                            marginLeft: '10px',
                        },
                        '& .MuiListItemIcon-root': {
                            minWidth: 'unset !important',
                            color: 'unset !important',
                        },
                        '& .MuiListItemButton-root': {
                            padding: '8px 10px',
                        },
                        '&::-webkit-scrollbar': {
                            width: '10px',
                        },
                        '&::-webkit-scrollbar-track-piece': {
                            margin: '4px 0',
                        },
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto',
                        borderRadius: '0.75rem',
                        backgroundColor: 'rgb(255, 255, 255)',
                        margin: '16px',
                    }}
                >
                    {filteredChats.map((chat) => {
                        return (
                            <ListItem
                                key={chat.id}
                                sx={{
                                    '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '0',
                                        left: '20%',
                                        width: '60%',
                                        height: '1px',
                                        backgroundColor: 'rgb(230, 239, 255)',
                                    },
                                    '&:last-of-type:after': {
                                        height: '0',
                                    },
                                    padding: '16px 32px',
                                    '@media (max-width: 480px)': {
                                        padding: '16px 24px',
                                    },
                                }}
                            >
                                <ListItemButton
                                    selected={chat.id === openChat.id}
                                    sx={{
                                        borderRadius: '1.5rem',
                                        padding: '10px 20px !important',
                                        '&:hover': {
                                            backgroundColor:
                                                'rgb(230, 239, 255, 0.7) !important',
                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: 'unset',
                                        },
                                        '&.Mui-selected .MuiListItemIcon-root:first-of-type':
                                            {
                                                display: 'flex',
                                            },
                                    }}
                                    onClick={(event) =>
                                        handleSetOpenChat(event, chat)
                                    }
                                    onMouseEnter={handleShowDeleteIcon}
                                    onMouseLeave={handleHideDeleteIcon}
                                >
                                    <ListItemIcon
                                        sx={{
                                            width: '20px',
                                            display: 'none',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <CircleIcon
                                            sx={{
                                                fontSize: '10px',
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            chat.messages.find(
                                                (message) =>
                                                    message.role === 'user'
                                            )?.content || 'No messages yet...'
                                        }
                                        sx={{
                                            '& .MuiTypography-root': {
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            },
                                        }}
                                    />
                                    <ListItemIcon
                                        sx={{
                                            display: 'none',
                                            padding: '5px',
                                        }}
                                        onClick={(event) =>
                                            handleDeleteChat(event, chat)
                                        }
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </ListItemIcon>
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
                <Button
                    variant="outlined"
                    color="primary"
                    className="m-auto mt-4 flex w-32 justify-start px-[10px] py-2 text-dark-blue"
                    onClick={handleNewChat}
                >
                    <AddIcon fontSize="small" />
                    <span className="ml-[6px]">New Chat</span>
                </Button>
            </Box>
        </Drawer>
    )
}

export default ChatList
