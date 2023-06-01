import React, { useEffect, useState } from 'react'
import { trpc } from '@utils/trpc'
import { Link, useNavigate } from 'react-router-dom'
import { getDetailsFromStorage } from '@utils/getDetailsFromStorage'
import {
    MainContainer,
    ChatContainer,
    MessageList,
    MessageInput,
    Message,
    Avatar,
    TypingIndicator,
} from '@chatscope/chat-ui-kit-react'
import gptIcon from '@static/icon2.png'
import { sendToUrl } from '@utils/sendToUrl'

const Conversation = () => {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState(null)
    const [apiKey, setApiKey] = useState(null)
    const [userInitials, setUserInitials] = useState(null)
    const [chat, setChat] = useState([])
    const [message, setMessage] = useState('')

    const shouldFetch =
        !!(firstName && apiKey) &&
        (chat[chat.length - 1]?.role === 'user' || chat.length === 0)

    const { isSuccess, isFetching, isError, data } = trpc.conversation.useQuery(
        { firstName, apiKey, conversation: chat },
        { enabled: shouldFetch }
    )

    useEffect(() => {
        if (isSuccess) {
            setChat([...chat, data.choices[0].message])
        }
    }, [isSuccess, data])

    useEffect(() => {
        getDetailsFromStorage().then(({ firstName, lastName, userAPIKey }) => {
            if (!firstName || !lastName || !userAPIKey) {
                navigate('/details')
            } else {
                setFirstName(firstName)
                setApiKey(userAPIKey)
                const initials = [firstName, lastName].map((name: string) => {
                    return name.charAt(0).toUpperCase()
                })
                setUserInitials(initials.join(''))
            }
        })
        const links = [...document.getElementsByTagName('a')]
        links.forEach((link) => {
            link.addEventListener('click', (e: any) => {
                const url = e.target.innerText
                sendToUrl(e, url)
            })
        })
    })

    const handleMessageSubmit = (message: string) => {
        setChat([...chat, { content: message, role: 'user' }])
        setMessage('')
    }

    return (
        <div className="flex w-full grow flex-col items-center justify-center overflow-scroll bg-one">
            {isError ? (
                <div className="w-3/4 text-center text-base text-two">
                    There was an error connecting to BrowseGPT, please check
                    your{' '}
                    <Link to="/details" className="font-semibold underline">
                        API key
                    </Link>{' '}
                    and retry.
                </div>
            ) : (
                <MainContainer className="my-1 flex w-full border-0">
                    <ChatContainer className="bg-one text-base text-two">
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
                            {chat.map((section, index: number) => {
                                const links =
                                    section.content.match(/\bhttps?:\/\/\S+/gi)
                                links?.forEach((link: string) => {
                                    section.content =
                                        section.content.replaceAll(
                                            link,
                                            `<a class="underline cursor-pointer">${link}</a>`
                                        )
                                })
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
                                            avatarPosition="center-left"
                                        >
                                            <Avatar className="flex items-center justify-center bg-three">
                                                <img
                                                    src={gptIcon}
                                                    className="h-8 w-8 rounded-none"
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
                                            avatarPosition="center-right"
                                        >
                                            <Avatar className="flex items-center justify-center bg-three">
                                                {userInitials}
                                            </Avatar>
                                        </Message>
                                    )
                                }
                            })}
                        </MessageList>
                        <MessageInput
                            placeholder="Type your message here..."
                            attachButton={false}
                            sendButton={false}
                            onChange={(value) => setMessage(value)}
                            onSend={(message) => handleMessageSubmit(message)}
                            value={message}
                            className="border-0 bg-one py-4"
                        />
                    </ChatContainer>
                </MainContainer>
            )}
        </div>
    )
}

export default Conversation
