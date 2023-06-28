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
import gptIcon from '@public/icon-light.png'
import { getCurrentTab } from '@utils/getCurrentTab'

const Conversation = ({ setChats, setOpenChat }) => {
    const navigate = useNavigate()
    const chats = useContext(ChatsArrayContext)
    const openChat = useContext(OpenChatContext)
    const [firstName, setFirstName] = useState('')
    const [userLocation, setUserLocation] = useState([])
    const [userInitials, setUserInitials] = useState('')
    const [message, setMessage] = useState('')
    const loading = !openChat || !firstName || !userInitials
    const shouldFetch =
        !!firstName &&
        !loading &&
        (openChat.messages[openChat.messages?.length - 1]?.role === 'user' ||
            openChat.messages?.length === 0)
    const { isSuccess, isFetching, isError, data } = trpc.conversation.useQuery(
        {
            firstName,
            conversation: { ...openChat, userLocation },
        },
        { enabled: shouldFetch }
    )

    useEffect(() => {
        const getUserDetails = async () => {
            const { firstName, lastName, userLocation } =
                await getDetailsFromStorage()
            if (!firstName || !lastName) {
                navigate('/details')
            } else {
                setFirstName(firstName)
                setUserLocation(userLocation)
                setUserInitials(getInitials([firstName, lastName]))
            }
        }
        getUserDetails()
        const getOpenChat = async () => {
            const existingChats = await getChatsFromStorage()
            setChats(existingChats)
            const previouslyOpenChat = existingChats.find(
                (chat) => chat.isOpen === true
            )
            if (previouslyOpenChat) {
                setOpenChat(previouslyOpenChat)
            } else {
                setOpenChat({
                    id: uuid(),
                    messages: [],
                    isOpen: true,
                })
            }
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

    const handleMessageSubmit = async (message: string) => {
        const strippedMessage = stripHTMLTags(message)
        const currentUrl = await getCurrentTab()
        setOpenChat({
            ...openChat,
            messages: [
                ...openChat.messages,
                {
                    content: strippedMessage,
                    role: 'user',
                    url: currentUrl,
                },
            ],
        })
        setMessage('')
    }

    return (
        <div className="flex w-full grow flex-col items-center justify-center overflow-scroll bg-light-blue">
            {isError ? (
                <ChatError />
            ) : (
                <MainContainer className="my-1 flex h-[95%] w-5/6 rounded-xl border-0">
                    <ChatContainer className="z-0 bg-white text-base text-dark-blue">
                        <MessageList
                            className="flex flex-col bg-white text-base text-dark-blue"
                            typingIndicator={
                                isFetching && (
                                    <TypingIndicator
                                        content="BrowseGPT is thinking..."
                                        className="static flex h-6 items-center bg-white pb-0 pl-4"
                                    />
                                )
                            }
                        >
                            {!loading &&
                                openChat.messages.map(
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
                                                    className="my-4"
                                                    avatarPosition="tl"
                                                >
                                                    <Avatar className="flex h-10 min-h-fit w-10 min-w-fit items-center justify-center bg-dark-blue">
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
                                                    className="my-4"
                                                    avatarPosition="tr"
                                                >
                                                    <Avatar className="text-md flex h-10 min-h-fit w-10 min-w-fit items-center justify-center bg-dark-blue font-medium text-white">
                                                        {userInitials}
                                                    </Avatar>
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
                            onSend={(message) => handleMessageSubmit(message)}
                            value={message}
                            className="mx-4 items-center justify-center rounded border-0 bg-white py-4"
                        />
                    </ChatContainer>
                </MainContainer>
            )}
        </div>
    )
}

export default Conversation
