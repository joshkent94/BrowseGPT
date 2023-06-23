import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Drawer,
    ListItemIcon,
    Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CircleIcon from '@mui/icons-material/Circle'
import { v4 as uuid } from 'uuid'
import { MouseEvent, useContext } from 'react'
import { ChatsArrayContext, OpenChatContext } from '@utils/context'

const ChatList = ({ open, setOpen, setOpenChat, setChats }) => {
    const existingChats = useContext(ChatsArrayContext)
    const openChat = useContext(OpenChatContext)

    const handleNewChat = () => {
        setOpenChat({ id: uuid(), isOpen: true, messages: [] })
        setOpen(false)
    }

    const handleSetOpenChat = (event: MouseEvent, chat: Chat) => {
        setOpenChat(chat)
        setOpen(false)
    }

    const handleShowDeleteIcon = (event: MouseEvent) => {
        const deleteIcon = event.currentTarget.querySelectorAll(
            '.MuiListItemIcon-root'
        )[1] as HTMLElement
        deleteIcon.style.display = 'block'
    }

    const handleHideDeleteIcon = (event: MouseEvent) => {
        const deleteIcon = event.currentTarget.querySelectorAll(
            '.MuiListItemIcon-root'
        )[1] as HTMLElement
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
            sx={{
                flexShrink: 0,
                position: 'static',
                zIndex: 10,
                '& .MuiDrawer-paper': {
                    width: 300,
                    boxSizing: 'border-box',
                    backgroundColor: '#0e1c36',
                    borderRight: '1px solid #afcbff',
                    paddingBottom: '56px',
                },
                '& *': {
                    zIndex: '10 !important',
                },
            }}
        >
            <Toolbar />
            <Box sx={{ overflow: 'auto', zIndex: 10 }}>
                <List
                    disablePadding
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
                    }}
                >
                    <ListItem key={'new-chat'} disablePadding>
                        <ListItemButton
                            className="text-two hover:bg-two hover:text-one"
                            onClick={handleNewChat}
                        >
                            <ListItemIcon>
                                <AddIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={'New Chat'} />
                        </ListItemButton>
                    </ListItem>
                    <Divider className="bg-two" />
                    {existingChats.map((chat) => {
                        return (
                            <ListItem key={chat.id} disablePadding>
                                <ListItemButton
                                    className="hover:bg-two hover:text-one"
                                    selected={chat.id === openChat.id}
                                    sx={{
                                        '&.Mui-selected': {
                                            backgroundColor:
                                                'rgb(175, 203, 255, 0.1)',
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
                                            display: 'flex',
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
            </Box>
        </Drawer>
    )
}

export default ChatList
