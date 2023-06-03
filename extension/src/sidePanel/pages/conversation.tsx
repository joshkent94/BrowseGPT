import { getChatFromStorage } from '@utils/getChatFromStorage'
import React, { useEffect, useState } from 'react'
import Chat from '@components/chat'
import { Box, Button, Modal, Typography } from '@mui/material'
import { getDetailsFromStorage } from '@utils/getDetailsFromStorage'
import { useNavigate } from 'react-router-dom'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#d7f9ff',
    borderRadius: '10px',
    color: '#0e1c36',
    p: '16px 20px 18px 20px',
    zIndex: 1000,
}

const Conversation = () => {
    const navigate = useNavigate()
    const [existingChat, setExistingChat] = useState([])
    const [open, setOpen] = useState(false)
    const [firstName, setFirstName] = useState(null)
    const [apiKey, setApiKey] = useState(null)
    const [userInitials, setUserInitials] = useState(null)
    const [continueChat, setContinueChat] = useState(false)

    useEffect(() => {
        getChatFromStorage().then((chat) => {
            chat && setExistingChat(chat)
            chat?.length > 1 && setOpen(true)
        })
    }, [])

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
    })

    let content
    if (existingChat.length > 1 && open && !continueChat) {
        content = (
            <>
                <Modal
                    open={open}
                    onClose={(event: React.SyntheticEvent) => {
                        event.preventDefault()
                    }}
                    disableEscapeKeyDown
                >
                    <Box sx={style}>
                        <div className="mb-4">
                            <Typography>
                                Want to carry on your previous conversation?
                            </Typography>
                        </div>
                        <div className="flex w-full justify-end">
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => {
                                    setOpen(false)
                                }}
                            >
                                No
                            </Button>
                            <Button
                                variant="outlined"
                                color="success"
                                size="small"
                                onClick={() => {
                                    setContinueChat(true)
                                    setOpen(false)
                                }}
                                className="ml-3"
                            >
                                Yes
                            </Button>
                        </div>
                    </Box>
                </Modal>
                <Chat
                    existingChat={existingChat}
                    firstName={firstName}
                    apiKey={apiKey}
                    userInitials={userInitials}
                />
            </>
        )
    } else if (existingChat.length > 1 && !open && continueChat) {
        content = (
            <Chat
                existingChat={existingChat}
                firstName={firstName}
                apiKey={apiKey}
                userInitials={userInitials}
            />
        )
    } else {
        content = (
            <Chat
                existingChat={[]}
                firstName={firstName}
                apiKey={apiKey}
                userInitials={userInitials}
            />
        )
    }

    return content
}

export default Conversation
