import {
    CircularProgress,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import CircleIcon from '@mui/icons-material/Circle'
import { trpc } from '@utils/trpc'
import { toast } from 'react-toastify'
import { useGptStore } from '@utils/store'
import { useNavigate } from 'react-router-dom'
import { MouseEvent } from 'react'
import { unauthorizedLogout } from '@utils/auth/unauthorizedLogout'

type ChatListItemProps = {
    chat: Chat
    setOpen: (open: boolean) => void
}

const ChatListItem = ({ chat, setOpen }: ChatListItemProps) => {
    const {
        openChat,
        setOpenChat,
        userChats,
        setUserChats,
        setIsStartingChat,
    } = useGptStore()
    const navigate = useNavigate()

    const createNewChatMutation = trpc.addChat.useMutation({
        onSuccess: (newChat: Chat) => {
            // set all existing chats to not open first
            if (userChats.length !== 0) {
                const closedChats = userChats.map((chat: Chat) => {
                    return { ...chat, isOpen: false }
                })
                setUserChats([...closedChats, newChat])
            } else {
                setUserChats([newChat])
            }
            setOpenChat(newChat)
            setOpen(false)
        },
        onError: (error) => {
            setIsStartingChat(false)
            if (error.data?.httpStatus === 401) {
                unauthorizedLogout()
                navigate('/login', {
                    replace: true,
                })
            } else {
                toast.error('Error creating chat')
            }
        },
    })

    const setOpenChatMutation = trpc.setOpenChat.useMutation({
        onSuccess: (newOpenChat: Chat) => {
            setOpenChat(newOpenChat)
            setUserChats(
                userChats.map((chat: Chat) => {
                    if (chat.id === newOpenChat.id) {
                        return { ...chat, isOpen: true }
                    }
                    return { ...chat, isOpen: false }
                })
            )
            setIsStartingChat(false)
            setOpen(false)
        },
        onError: (error) => {
            setIsStartingChat(false)
            if (error.data?.httpStatus === 401) {
                unauthorizedLogout()
                navigate('/login', {
                    replace: true,
                })
            } else {
                toast.error('Error setting open chat')
            }
        },
    })

    const deleteChatMutation = trpc.deleteChat.useMutation({
        onSuccess: (deletedChatId) => {
            toast.success('Chat successfully deleted')
            const newChatsArray = userChats.filter(
                (existingChat) => existingChat.id !== deletedChatId
            )
            setUserChats(newChatsArray)
            if (openChat.id === deletedChatId) {
                if (newChatsArray?.length > 0) {
                    setIsStartingChat(true)
                    setOpenChatMutation.mutate({
                        chatId: newChatsArray[0].id,
                    })
                } else {
                    handleNewChat()
                }
            }
        },
        onError: (error) => {
            if (error.data?.httpStatus === 401) {
                unauthorizedLogout()
                navigate('/login', {
                    replace: true,
                })
            } else {
                toast.error('Error deleting chat')
            }
        },
    })

    const handleNewChat = () => {
        setIsStartingChat(true)
        createNewChatMutation.mutate()
    }

    const handleSetOpenChat = (event: MouseEvent, chat: Chat) => {
        event.stopPropagation()
        setIsStartingChat(true)
        setOpenChatMutation.mutate({
            chatId: chat.id,
        })
    }

    const handleShowDeleteIcon = (event: MouseEvent) => {
        if (deleteChatMutation.isLoading || setOpenChatMutation.isLoading)
            return
        const icons = event.currentTarget.querySelectorAll(
            '.MuiListItemIcon-root'
        )
        const deleteIcon = icons[icons?.length - 1] as HTMLElement
        deleteIcon.style.display = 'block'
    }

    const handleHideDeleteIcon = (event: MouseEvent) => {
        if (deleteChatMutation.isLoading || setOpenChatMutation.isLoading)
            return
        const icons = event.currentTarget.querySelectorAll(
            '.MuiListItemIcon-root'
        )
        const deleteIcon = icons[icons?.length - 1] as HTMLElement
        deleteIcon.style.display = 'none'
    }

    const handleDeleteChat = (event: MouseEvent, chat: Chat) => {
        event.stopPropagation()
        deleteChatMutation.mutate({
            chatId: chat.id,
        })
    }

    return (
        <ListItem
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
                        backgroundColor: 'rgb(230, 239, 255, 0.7) !important',
                    },
                    '&.Mui-selected': {
                        backgroundColor: 'unset',
                    },
                    '&.Mui-selected .MuiListItemIcon-root:first-of-type': {
                        display: 'flex',
                    },
                }}
                onClick={(event) => handleSetOpenChat(event, chat)}
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
                        chat.messages.find((message) => message.role === 'user')
                            ?.content || 'No user messages yet...'
                    }
                    sx={{
                        '& .MuiTypography-root': {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        },
                    }}
                />
                {deleteChatMutation.isLoading ||
                setOpenChatMutation.isLoading ? (
                    <ListItemIcon
                        sx={{
                            padding: '5px',
                        }}
                    >
                        <CircularProgress size={20} />
                    </ListItemIcon>
                ) : (
                    <ListItemIcon
                        sx={{
                            display: 'none',
                            padding: '5px',
                        }}
                        onClick={(event) => handleDeleteChat(event, chat)}
                    >
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                )}
            </ListItemButton>
        </ListItem>
    )
}

export default ChatListItem
