import { FC, useEffect, useRef, useState } from 'react'
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
import gptIcon from '@public/icon.png'
import { getUserLocation } from '@utils/user/getUserLocation'
import CircularProgress from '@mui/material/CircularProgress'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { unauthorizedLogout } from '@utils/auth/unauthorizedLogout'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import Commands from '@components/chat/commands'
import { commands } from '@utils/misc/commandList'

const Chat: FC = () => {
    const open = useOutletContext()
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
    const [anchor, setAnchor] = useState<null | HTMLElement>(null)
    const [selectedCommand, setSelectedCommand] = useState<string | null>(null)
    const messageInput = useRef<HTMLInputElement>(null)

    const focusMessageInput = () => {
        setTimeout(() => {
            messageInput.current?.focus()
        }, 100)
    }

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
        onSuccess: (newMessage: Message, context) => {
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
            focusMessageInput()
            if (context && context.message?.isCommand) {
                const messageAsHtml = new DOMParser().parseFromString(
                    marked.parse(newMessage.content, {
                        mangle: false,
                        headerIds: false,
                    }),
                    'text/html'
                )
                messageAsHtml.querySelectorAll('a').forEach((link) => {
                    const url = link.getAttribute('href')
                    chrome.tabs.create({ url })
                })
            }
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
        if (!firstName) {
            navigate('/profile', {
                replace: true,
            })
        }
    })

    useEffect(() => {
        if (!open) {
            focusMessageInput()
        }
    }, [open])

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

    useEffect(() => {
        if (selectedCommand) {
            const commandObj = commands.find(
                (command) => command.value === selectedCommand
            )
            setMessage(
                `<span id="command-tag" class="bg-dark-blue text-light-blue px-2 py-1 rounded text-xs mr-2 self-center min-w-fit caret-[transparent] cursor-default">${commandObj.name}</span><p class="grow min-h-[20px] leading-5"></p>`
            )
        } else {
            setMessage('')
        }
    }, [selectedCommand])

    const handleMessageChange = (value: string) => {
        if (selectedCommand) {
            const commandName = commands.find(
                (command) => command.value === selectedCommand
            )?.name
            const commandTag = document.getElementById('command-tag')
            if (commandTag?.innerText !== commandName) {
                setSelectedCommand(null)
                setMessage('')
                return
            }
        }
        if (value.startsWith('/')) {
            setAnchor(document.getElementById('message-input'))
        } else {
            setAnchor(null)
        }
        setMessage(value)
    }

    const handleMessageSubmit = async (message: string) => {
        setMessage('')
        let strippedMessage = stripHTMLTags(message)
        if (selectedCommand) {
            const commandName = commands.find(
                (command) => command.value === selectedCommand
            )?.name
            strippedMessage = `Search for ${strippedMessage.replace(
                `${commandName}`,
                ''
            )} on ${commandName} and send me the link.`
            setSelectedCommand(null)
        }
        const currentUrl = await getCurrentTab()
        const newMessage: Message = {
            content: strippedMessage,
            role: 'user',
            url: currentUrl,
            isCommand: !!selectedCommand,
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
                <MainContainer className="my-1 flex h-[calc(100%-30px)] w-[calc(100%-80px)] items-center justify-center rounded-xl border border-midnight-blue border-opacity-30">
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
                                                        <Avatar className="flex h-10 min-h-fit w-10 min-w-fit items-center justify-center bg-light-blue">
                                                            <img
                                                                src={gptIcon}
                                                                className="h-7 w-7 rounded-none"
                                                            />
                                                        </Avatar>
                                                        <Message.HtmlContent
                                                            className="overflow-auto"
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
                                                            className="overflow-auto"
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
                                ref={messageInput}
                                id="message-input"
                                placeholder="Type a message..."
                                attachButton={false}
                                onChange={(value) => handleMessageChange(value)}
                                onSend={(message) =>
                                    handleMessageSubmit(message)
                                }
                                value={message}
                                disabled={sendMessageMutation.isLoading}
                                sendDisabled={message.length === 0}
                                className="mx-4 items-center justify-center rounded border-0 bg-white py-4"
                            />
                        </ChatContainer>
                    ) : (
                        <CircularProgress />
                    )}
                    <Commands
                        anchor={anchor}
                        setAnchor={setAnchor}
                        searchTerm={message}
                        selectedCommand={selectedCommand}
                        setSelectedCommand={setSelectedCommand}
                    />
                </MainContainer>
            )}
        </div>
    )
}

export default Chat
