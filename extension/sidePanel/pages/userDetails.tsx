import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import Box from '@mui/system/Box'
import { decryptString } from '@utils/decryptString'
import { encryptString } from '@utils/encryptString'
import { getDetailsFromStorage } from '@utils/getDetailsFromStorage'
import { getUserLocation } from '@utils/getUserLocation'
import { sendToUrl } from '@utils/sendToUrl'
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const UserDetails = () => {
    const [firstName, setFirstName] = useState('')
    const [firstNameValid, setFirstNameValid] = useState(true)
    const [lastName, setLastName] = useState('')
    const [lastNameValid, setLastNameValid] = useState(true)
    const [userAPIKey, setUserAPIKey] = useState('')
    const [APIKeyValid, setAPIKeyValid] = useState(true)
    const [formValid, setFormValid] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const getUserDetails = async () => {
            const { firstName, lastName, encryptedAPIKey, salt } =
                await getDetailsFromStorage()
            if (firstName) setFirstName(firstName)
            if (lastName) setLastName(lastName)
            if (encryptedAPIKey && salt) {
                setUserAPIKey(decryptString(encryptedAPIKey, salt))
            }
        }
        getUserDetails()
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
            firstName?.length &&
            firstNameValid &&
            lastName?.length &&
            lastNameValid &&
            userAPIKey?.length &&
            APIKeyValid
        ) {
            setFormValid(true)
        } else {
            setFormValid(false)
        }
    }, [firstName, lastName, userAPIKey])

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault()
        setIsLoading(true)
        const [encryptedAPIKey, salt] = encryptString(userAPIKey)
        const { latitude, longitude } = await getUserLocation()
        await chrome.storage.sync.set({
            firstName,
            lastName,
            encryptedAPIKey,
            salt,
            latitude,
            longitude,
        })
        setIsLoading(false)
        navigate('/')
    }

    const helperContent = [
        <span key={1}>Click </span>,
        <button
            key={2}
            onClick={(event: any) =>
                sendToUrl(event, 'https://platform.openai.com/account/api-keys')
            }
            className="font-bold underline"
        >
            here
        </button>,
        <span key={3}> to get your API key</span>,
    ]

    return (
        <div className="flex h-full w-full items-center justify-center bg-light-blue">
            <Box
                component="form"
                className="flex h-[95%] w-5/6 flex-col items-center justify-center rounded-xl bg-white"
                onSubmit={handleSubmit}
            >
                <TextField
                    id="first-name-input"
                    label="First Name"
                    value={firstName}
                    error={!firstNameValid}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setFirstName(event.target.value)
                    }}
                    color="primary"
                    required
                    autoComplete="off"
                    placeholder="John"
                    variant="outlined"
                    sx={{
                        width: 240,
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                        },
                        '& .MuiInputLabel-outlined': {
                            color: 'text.primary',
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'text.primary',
                        },
                    }}
                />
                <TextField
                    id="last-name-input"
                    label="Last Name"
                    className="mt-9"
                    value={lastName}
                    error={!lastNameValid}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setLastName(event.target.value)
                    }}
                    color="primary"
                    required
                    autoComplete="off"
                    placeholder="Smith"
                    variant="outlined"
                    sx={{
                        width: 240,
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                        },
                        '& .MuiInputLabel-outlined': {
                            color: 'text.primary',
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'text.primary',
                        },
                    }}
                />
                <TextField
                    id="api-key-input"
                    className="mt-9"
                    label="API Key"
                    value={userAPIKey}
                    error={!APIKeyValid}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        setUserAPIKey(event.target.value)
                    }}
                    color="primary"
                    required
                    autoComplete="off"
                    placeholder="OpenAI API Key"
                    variant="outlined"
                    type="password"
                    sx={{
                        width: 240,
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                        },
                        '& .MuiInputLabel-outlined': {
                            color: 'text.primary',
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'text.primary',
                        },
                        '& .MuiFormHelperText-contained': {
                            opacity: 0.7,
                            color: 'text.primary',
                        },
                    }}
                    helperText={helperContent}
                />
                <LoadingButton
                    variant="outlined"
                    color="primary"
                    className="mt-12"
                    type="submit"
                    sx={{
                        width: 120,
                        '&.MuiButtonBase-root': {
                            borderColor: 'primary.main',
                        },
                        '&.MuiButtonBase-root:disabled': {
                            cursor: 'not-allowed',
                            pointerEvents: 'auto',
                            borderColor: 'rgba(14, 28, 54, 0.3)',
                        },
                        '&.MuiButtonBase-root:disabled:hover': {
                            background: 'unset',
                        },
                    }}
                    disabled={!formValid}
                    loading={isLoading}
                >
                    Save
                </LoadingButton>
            </Box>
        </div>
    )
}

export default UserDetails
