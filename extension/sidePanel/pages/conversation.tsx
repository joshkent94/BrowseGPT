import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import {
    MainContainer,
    ChatContainer,
    MessageList,
    MessageInput,
    Message,
    Avatar,
    TypingIndicator,
} from '@chatscope/chat-ui-kit-react'
import ChatError from '@components/chatError'
import { getChatsFromStorage } from '@utils/getChatsFromStorage'
import { getDetailsFromStorage } from '@utils/getDetailsFromStorage'
import { trpc } from '@utils/trpc'
import { stripHTMLTags } from '@utils/sanitiseString'
import { ChatsArrayContext, OpenChatContext } from '@utils/context'
import { sendChatsToStorage } from '@utils/sendChatsToStorage'
import { getInitials } from '@utils/getInitials'
import { addEventListenersToLinks } from '@utils/addEventListenersToLinks'
import { formatLinks } from '@utils/formatLinks'
import gptIcon from '@public/icon2.png'

const Conversation = ({ setChats, setOpenChat }) => {
    const navigate = useNavigate()
    const chats = useContext(ChatsArrayContext)
    const openChat = useContext(OpenChatContext)
    const [firstName, setFirstName] = useState('')
    const [apiKey, setApiKey] = useState('')
    const [salt, setSalt] = useState('')
    const [userInitials, setUserInitials] = useState('')
    const [message, setMessage] = useState('')
    const loading = !openChat || !firstName || !apiKey || !salt || !userInitials
    const shouldFetch =
        !!(firstName && apiKey && salt) &&
        !loading &&
        (openChat.messages[openChat.messages.length - 1]?.role === 'user' ||
            openChat.messages?.length === 0)
    const { isSuccess, isFetching, isError, data } = trpc.conversation.useQuery(
        { firstName, apiKey, salt, conversation: openChat.messages },
        { enabled: shouldFetch }
    )

    useEffect(() => {
        const getUserDetails = async () => {
            const { firstName, lastName, encryptedAPIKey, salt } =
                await getDetailsFromStorage()
            if (!firstName || !lastName || !encryptedAPIKey || !salt) {
                navigate('/details')
            } else {
                setFirstName(firstName)
                setApiKey(encryptedAPIKey)
                setSalt(salt)
                setUserInitials(getInitials([firstName, lastName]))
            }
        }
        getUserDetails()
        const getOpenChat = async () => {
            const existingChats = await getChatsFromStorage()
            setChats(existingChats)
            setOpenChat(
                existingChats.find((chat) => chat.isOpen === true) || {
                    id: uuid(),
                    messages: [],
                    isOpen: true,
                }
            )
        }
        getOpenChat()
    }, [])

    useEffect(() => {
        if (isSuccess) {
            setOpenChat({
                ...openChat,
                messages: [...openChat.messages, data],
            })
        }
    }, [isSuccess, data])

    useEffect(() => {
        addEventListenersToLinks()
        if (openChat.messages?.length > 0) {
            sendChatsToStorage(chats, openChat, setChats)
        }
    }, [openChat])

    const handleMessageSubmit = (message: string) => {
        const strippedMessage = stripHTMLTags(message)
        setOpenChat({
            ...openChat,
            messages: [
                ...openChat.messages,
                { content: strippedMessage, role: 'user' },
            ],
        })
        setMessage('')
    }

    return (
        !loading && (
            <div className="flex w-full grow flex-col items-center justify-center overflow-scroll bg-one">
                {isError ? (
                    <ChatError />
                ) : (
                    <MainContainer className="my-1 flex w-full border-0">
                        <ChatContainer className="z-0 bg-one text-base text-two">
                            <MessageList
                                className="flex flex-col bg-one text-base text-two"
                                typingIndicator={
                                    isFetching && (
                                        <TypingIndicator
                                            content="BrowseGPT is thinking..."
                                            className="static flex h-6 w-full items-center bg-one pb-0 pl-4 text-base text-two"
                                        />
                                    )
                                }
                            >
                                {openChat.messages.map(
                                    (section: Message, index: number) => {
                                        section = formatLinks(section)
                                        if (section.role === 'assistant') {
                                            return (
                                                <Message
                                                    key={index}
                                                    model={{
                                                        message: `${section.content}`,
                                                        sender: 'BrowseGPT',
                                                        direction: 'incoming',
                                                        position: 'single',
                                                    }}
                                                    className="my-4 items-center"
                                                    avatarPosition="center-left"
                                                >
                                                    <Avatar className="flex h-10 min-h-fit w-10 min-w-fit items-center justify-center bg-three">
                                                        <img
                                                            src={gptIcon}
                                                            className="h-6 w-6 rounded-none"
                                                        />
                                                    </Avatar>
                                                </Message>
                                            )
                                        } else {
                                            return (
                                                <Message
                                                    key={index}
                                                    model={{
                                                        message: `${section.content}`,
                                                        sender: `${firstName}`,
                                                        direction: 'outgoing',
                                                        position: 'single',
                                                    }}
                                                    className="my-4 items-center"
                                                    avatarPosition="center-right"
                                                >
                                                    <Avatar className="text-md flex h-10 min-h-fit w-10 min-w-fit items-center justify-center bg-three font-medium">
                                                        {userInitials}
                                                    </Avatar>
                                                </Message>
                                            )
                                        }
                                    }
                                )}
                            </MessageList>
                            <MessageInput
                                placeholder="Type your message here..."
                                attachButton={false}
                                sendButton={false}
                                onChange={(value) => setMessage(value)}
                                onSend={(message) =>
                                    handleMessageSubmit(message)
                                }
                                value={message}
                                className="border-0 bg-one py-4"
                            />
                        </ChatContainer>
                    </MainContainer>
                )}
            </div>
        )
    )
}

export default Conversation
