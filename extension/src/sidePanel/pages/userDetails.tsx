import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/system/Box'
import { getDetailsFromStorage } from '@utils/getDetailsFromStorage'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const UserDetails = () => {
    const [firstName, setFirstName] = useState('')
    const [firstNameValid, setFirstNameValid] = useState(true)
    const [lastName, setLastName] = useState('')
    const [lastNameValid, setLastNameValid] = useState(true)
    const [userAPIKey, setUserAPIKey] = useState('')
    const [APIKeyValid, setAPIKeyValid] = useState(true)
    const [formValid, setFormValid] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        getDetailsFromStorage().then(({ firstName, lastName, userAPIKey }) => {
            if (firstName) setFirstName(firstName)
            if (lastName) setLastName(lastName)
            if (userAPIKey) setUserAPIKey(userAPIKey)
        })
    }, [])

    useEffect(() => {
        const pattern = /^[a-zA-Z0-9!@#$%^&*)(+=._-]{0,60}$/
        pattern.test(firstName)
            ? setFirstNameValid(true)
            : setFirstNameValid(false)
        pattern.test(lastName)
            ? setLastNameValid(true)
            : setLastNameValid(false)
        pattern.test(userAPIKey) ? setAPIKeyValid(true) : setAPIKeyValid(false)
        if (
            firstName.length &&
            firstNameValid &&
            lastName.length &&
            lastNameValid &&
            userAPIKey.length &&
            APIKeyValid
        ) {
            setFormValid(true)
        } else {
            setFormValid(false)
        }
    }, [firstName, lastName, userAPIKey])

    useEffect(() => {
        if (
            firstName.length &&
            firstNameValid &&
            lastName.length &&
            lastNameValid &&
            userAPIKey.length &&
            APIKeyValid
        ) {
            setFormValid(true)
        } else {
            setFormValid(false)
        }
    }, [firstNameValid, lastNameValid, APIKeyValid])

    const handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault()
        await chrome.storage.sync.set({ firstName, lastName, userAPIKey })
        navigate('/')
    }

    const sendToAPIKey = (event: React.SyntheticEvent) => {
        event.preventDefault()
        chrome.runtime.sendMessage({
            message: {
                text: 'api-key-redirect',
                url: 'https://platform.openai.com/account/api-keys',
            },
        })
    }

    const helperContent = [
        <span key={1}>Click </span>,
        <button key={2} onClick={sendToAPIKey} className="font-bold underline">
            here
        </button>,
        <span key={3}> to get your API key</span>,
    ]

    return (
        <div className="flex h-full w-full items-center justify-center bg-one">
            <Box
                component="form"
                className="flex w-4/5 flex-col items-center"
                onSubmit={handleSubmit}
            >
                <TextField
                    id="first-name-input"
                    label="First Name"
                    value={firstName}
                    error={!firstNameValid}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setFirstName(event.target.value)
                    }}
                    color="secondary"
                    required
                    autoComplete="off"
                    placeholder="John"
                    variant="outlined"
                    sx={{
                        width: 300,
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'secondary.main',
                        },
                        '& .MuiInputLabel-outlined': {
                            color: 'text.primary',
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'text.secondary',
                        },
                    }}
                />
                <TextField
                    id="last-name-input"
                    label="Last Name"
                    className="mt-9"
                    value={lastName}
                    error={!lastNameValid}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setLastName(event.target.value)
                    }}
                    color="secondary"
                    required
                    autoComplete="off"
                    placeholder="Smith"
                    variant="outlined"
                    sx={{
                        width: 300,
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'secondary.main',
                        },
                        '& .MuiInputLabel-outlined': {
                            color: 'text.primary',
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'text.secondary',
                        },
                    }}
                />
                <TextField
                    id="api-key-input"
                    className="mt-9"
                    label="API Key"
                    value={userAPIKey}
                    error={!APIKeyValid}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setUserAPIKey(event.target.value)
                    }}
                    color="secondary"
                    required
                    autoComplete="off"
                    placeholder="OpenAI API Key"
                    variant="outlined"
                    sx={{
                        width: 300,
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'secondary.main',
                        },
                        '& .MuiInputLabel-outlined': {
                            color: 'text.primary',
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'text.secondary',
                        },
                        '& .MuiFormHelperText-contained': {
                            opacity: 0.7,
                        },
                    }}
                    helperText={helperContent}
                />
                <Button
                    variant="outlined"
                    color="secondary"
                    className="mt-14"
                    type="submit"
                    sx={{
                        width: 120,
                        '&.MuiButtonBase-root': {
                            borderColor: 'rgba(175, 203, 255, 1)',
                        },
                        '&.MuiButtonBase-root:disabled': {
                            cursor: 'not-allowed',
                            pointerEvents: 'auto',
                            color: 'text.primary',
                            borderColor: 'rgba(175, 203, 255, 0.5)',
                        },
                        '&.MuiButtonBase-root:disabled:hover': {
                            background: 'unset',
                        },
                    }}
                    disabled={!formValid}
                >
                    Save
                </Button>
            </Box>
        </div>
    )
}

export default UserDetails
