import { FC, useEffect, useState } from 'react'
import {
    MainContainer,
    ChatContainer,
    MessageList,
    MessageInput,
    Message,
    Avatar,
    TypingIndicator,
} from '@chatscope/chat-ui-kit-react'
import ChatError from '@components/chat/chatError'
import { trpc } from '@utils/trpc'
import { stripHTMLTags } from '@utils/chat/sanitiseString'
import { addEventListenersToLinks } from '@utils/chat/addEventListenersToLinks'
import { getCurrentTab } from '@utils/chat/getCurrentTab'
import { useGptStore } from '@utils/store'
import { getInitials } from '@utils/user/getInitials'
import gptIcon from '@public/icon-light.png'
import { getUserLocation } from '@utils/user/getUserLocation'
import CircularProgress from '@mui/material/CircularProgress'
import { useNavigate } from 'react-router-dom'
import { unauthorizedLogout } from '@utils/auth/unauthorizedLogout'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

const Chat: FC = () => {
    const navigate = useNavigate()
    const {
        user,
        isLoggingOut,
        openChat,
        setOpenChat,
        userChats,
        setUserChats,
        isStartingChat,
        setIsStartingChat,
    } = useGptStore()
    const { id, firstName, lastName, latitude, longitude } = user
    const [userInitials, setUserInitials] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [isError, setIsError] = useState<boolean>(false)

    const getAllChatsForUserQuery = trpc.getAllChatsForUser.useQuery(null, {
        enabled: Object.keys(openChat)?.length === 0 && id !== '',
        cacheTime: 0,
    })

    const createNewChatMutation = trpc.addChat.useMutation({
        onSuccess: async (newChat: Chat) => {
            setOpenChat(newChat)
            setUserChats([...userChats, newChat])
        },
        onError: (error) => {
            if (error.data?.httpStatus === 401) {
                unauthorizedLogout()
                navigate('/login', {
                    replace: true,
                })
            } else {
                setIsError(true)
            }
        },
    })

    const sendMessageMutation = trpc.sendMessage.useMutation({
        onSuccess: (newMessage: Message) => {
            setOpenChat({
                ...openChat,
                messages: [...openChat.messages, newMessage],
            })
            const currentChat = userChats.find((chat) => chat.isOpen)
            if (currentChat) {
                setUserChats([
                    ...userChats.filter((chat) => chat.id !== currentChat.id),
                    {
                        ...currentChat,
                        messages: [...currentChat.messages, newMessage],
                    },
                ])
            }
            setIsStartingChat(false)
        },
        onError: (error) => {
            if (error.data?.httpStatus === 401) {
                unauthorizedLogout()
                navigate('/login', {
                    replace: true,
                })
            } else {
                setIsStartingChat(false)
                setIsError(true)
            }
        },
    })

    useEffect(() => {
        setUserInitials(getInitials([firstName, lastName]))
    }, [firstName, lastName])

    useEffect(() => {
        if (getAllChatsForUserQuery.data) {
            setUserChats(getAllChatsForUserQuery.data as Chats)
            if (getAllChatsForUserQuery.data?.length > 0) {
                setOpenChat(
                    getAllChatsForUserQuery.data?.find(
                        (chat) => chat.isOpen
                    ) as Chat
                )
            } else if (Object.keys(openChat)?.length === 0) {
                setIsStartingChat(true)
                createNewChatMutation.mutate()
            }
        }
    }, [getAllChatsForUserQuery.data])

    useEffect(() => {
        if (getAllChatsForUserQuery.error?.data?.httpStatus === 401) {
            unauthorizedLogout()
            navigate('/login', {
                replace: true,
            })
        }
    }, [getAllChatsForUserQuery.error])

    useEffect(() => {
        addEventListenersToLinks()
        if (openChat.messages?.length === 0) {
            const sendInitialMessage = async () => {
                const { latitude, longitude } = await getUserLocation()
                sendMessageMutation.mutate({
                    chatId: openChat.id,
                    userLocation: [latitude, longitude],
                })
            }
            sendInitialMessage()
        }
    }, [openChat.messages])

    const handleMessageSubmit = async (message: string) => {
        setMessage('')
        const strippedMessage = stripHTMLTags(message)
        const currentUrl = await getCurrentTab()
        const newMessage: Message = {
            content: strippedMessage,
            role: 'user',
            url: currentUrl,
        }
        setOpenChat({
            ...openChat,
            messages: [...openChat.messages, newMessage],
        })
        const currentChat = userChats.find((chat) => chat.isOpen)
        if (currentChat) {
            setUserChats([
                ...userChats.filter((chat) => chat.id !== currentChat.id),
                {
                    ...currentChat,
                    messages: [...currentChat.messages, newMessage],
                },
            ])
        }
        sendMessageMutation.mutate({
            chatId: openChat.id,
            message: newMessage,
            userLocation: [latitude, longitude],
        })
    }

    return (
        <div className="flex w-full grow flex-col items-center justify-center overflow-scroll bg-light-blue">
            {isError ? (
                <ChatError />
            ) : (
                <MainContainer className="my-1 flex h-[95%] w-5/6 items-center justify-center rounded-xl border border-midnight-blue border-opacity-30">
                    {!getAllChatsForUserQuery.isFetching && !isLoggingOut ? (
                        <ChatContainer className="z-0 bg-white text-base text-dark-blue">
                            <MessageList
                                className="flex flex-col bg-white text-base text-dark-blue"
                                typingIndicator={
                                    (isStartingChat ||
                                        sendMessageMutation.isLoading) && (
                                        <TypingIndicator
                                            content="BrowseGPT is thinking..."
                                            className="static flex h-6 items-center bg-white pb-0 pl-4"
                                        />
                                    )
                                }
                            >
                                {openChat?.messages?.length > 0 &&
                                    openChat.messages.map(
                                        (section: Message, index: number) => {
                                            if (section.role === 'assistant') {
                                                return (
                                                    <Message
                                                        key={index}
                                                        model={{
                                                            sender: 'BrowseGPT',
                                                            direction:
                                                                'incoming',
                                                            position: 'single',
                                                        }}
                                                        className="my-4"
                                                        avatarPosition="tl"
                                                    >
                                                        <Avatar className="flex h-10 min-h-fit w-10 min-w-fit items-center justify-center bg-dark-blue">
                                                            <img
                                                                src={gptIcon}
                                                                className="h-6 w-6 rounded-none"
                                                            />
                                                        </Avatar>
                                                        <Message.HtmlContent
                                                            html={DOMPurify.sanitize(
                                                                marked.parse(
                                                                    section.content,
                                                                    {
                                                                        mangle: false,
                                                                        headerIds:
                                                                            false,
                                                                    }
                                                                )
                                                            )}
                                                        />
                                                    </Message>
                                                )
                                            } else {
                                                return (
                                                    <Message
                                                        key={index}
                                                        model={{
                                                            sender: `${firstName}`,
                                                            direction:
                                                                'outgoing',
                                                            position: 'single',
                                                        }}
                                                        className="my-4"
                                                        avatarPosition="tr"
                                                    >
                                                        <Avatar className="text-md flex h-10 min-h-fit w-10 min-w-fit cursor-default items-center justify-center bg-dark-blue font-medium text-light-blue">
                                                            {userInitials}
                                                        </Avatar>
                                                        <Message.HtmlContent
                                                            html={DOMPurify.sanitize(
                                                                marked.parse(
                                                                    section.content,
                                                                    {
                                                                        mangle: false,
                                                                        headerIds:
                                                                            false,
                                                                    }
                                                                )
                                                            )}
                                                        />
                                                    </Message>
                                                )
                                            }
                                        }
                                    )}
                            </MessageList>
                            <MessageInput
                                placeholder="Type a message..."
                                attachButton={false}
                                onChange={(value) => setMessage(value)}
                                onSend={(message) =>
                                    handleMessageSubmit(message)
                                }
                                value={message}
                                disabled={sendMessageMutation.isLoading}
                                className="mx-4 items-center justify-center rounded border-0 bg-white py-4"
                            />
                        </ChatContainer>
                    ) : (
                        <CircularProgress />
                    )}
                </MainContainer>
            )}
        </div>
    )
}

export default Chat
