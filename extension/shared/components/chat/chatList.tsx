import {
    Box,
    List,
    Toolbar,
    Drawer,
    TextField,
    InputAdornment,
    Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import { FC, useEffect, useState } from 'react'
import { useGptStore } from '@shared/utils/store'
import { trpc } from '@shared/utils/trpc'
import { toast } from 'react-toastify'
import LoadingButton from '@mui/lab/LoadingButton/LoadingButton'
import ChatListItem from '@shared/components/chat/chatListItem'
import { unauthorizedLogout } from '@shared/utils/auth/unauthorizedLogout'
import { useNavigate } from 'react-router-dom'

type ChatListProps = {
    open: boolean
    setOpen: (open: boolean) => void
}

const ChatList: FC<ChatListProps> = ({ open, setOpen }) => {
    const {
        userChats,
        setOpenChat,
        setUserChats,
        isStartingChat,
        setIsStartingChat,
    } = useGptStore()
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [filteredChats, setFilteredChats] = useState<Chats>(userChats)
    const navigate = useNavigate()

    const createNewChatMutation = trpc.addChat.useMutation({
        onSuccess: (newChat: Chat) => {
            setOpen(false)
            setOpenChat(newChat)
            // wait for drawer to close
            // set all existing chats to not open
            setTimeout(() => {
                if (userChats.length !== 0) {
                    const closedChats = userChats.map((chat: Chat) => {
                        return { ...chat, isOpen: false }
                    })
                    setUserChats([...closedChats, newChat])
                } else {
                    setUserChats([newChat])
                }
            }, 300)
        },
        onError: ({ data }) => {
            setIsStartingChat(false)
            if (data?.httpStatus === 401) {
                unauthorizedLogout()
                navigate('/login', {
                    replace: true,
                })
            } else {
                toast.error('Error creating chat')
            }
        },
    })

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredChats(userChats)
        } else {
            const filteredChats = userChats.filter((chat) => {
                const chatText = chat.messages.map((message) =>
                    message.content.toLowerCase()
                )
                return chatText.some((text) =>
                    text.includes(searchTerm.toLowerCase())
                )
            })
            setFilteredChats(filteredChats)
        }
    }, [searchTerm, userChats])

    const handleNewChat = () => {
        setIsStartingChat(true)
        createNewChatMutation.mutate()
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
                    paddingTop: '12px',
                    paddingBottom: '72px',
                    boxShadow: 'none',
                    alignItems: 'center',
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
                    height: 'calc(100vh - 30px)',
                    width: 'calc(100vw - 80px)',
                }}
            >
                <TextField
                    id="chat-search"
                    label="Search"
                    type="search"
                    value={searchTerm}
                    placeholder="Search..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment
                                position="start"
                                sx={{
                                    color: 'text.primary',
                                }}
                            >
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        m: '16px auto',
                        width: 240,
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                        },
                        '& .MuiInputLabel-outlined': {
                            color: 'text.primary',
                            fontSize: '14px',
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'text.primary',
                        },
                        '& .MuiInputBase-input': {
                            padding: '12px 12px 12px 0',
                            fontSize: '14px',
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
                    }}
                    className="my-2 flex grow flex-col overflow-auto rounded-xl border border-midnight-blue border-opacity-30 bg-white"
                >
                    <Typography variant="h6" className="mx-auto my-4">
                        Chats
                    </Typography>
                    {filteredChats.map((chat) => {
                        return (
                            <ChatListItem
                                key={chat.id}
                                chat={chat}
                                setOpen={setOpen}
                            />
                        )
                    })}
                </List>
                <LoadingButton
                    variant="outlined"
                    color="primary"
                    className="m-auto mt-4 flex w-32 justify-center px-[10px]"
                    onClick={handleNewChat}
                    loading={isStartingChat}
                    sx={{ textTransform: 'none' }}
                >
                    <AddIcon fontSize="small" className="mr-1" />
                    New Chat
                </LoadingButton>
            </Box>
        </Drawer>
    )
}

export default ChatList
