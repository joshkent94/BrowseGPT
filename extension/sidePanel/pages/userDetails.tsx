import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import Box from '@mui/system/Box'
import { getDetailsFromStorage } from '@utils/getDetailsFromStorage'
import { getUserLocation } from '@utils/getUserLocation'
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const UserDetails = () => {
    const [firstName, setFirstName] = useState('')
    const [firstNameValid, setFirstNameValid] = useState(true)
    const [lastName, setLastName] = useState('')
    const [lastNameValid, setLastNameValid] = useState(true)
    const [formValid, setFormValid] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const getUserDetails = async () => {
            const { firstName, lastName } = await getDetailsFromStorage()
            if (firstName) setFirstName(firstName)
            if (lastName) setLastName(lastName)
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
        if (
            firstName?.length &&
            firstNameValid &&
            lastName?.length &&
            lastNameValid
        ) {
            setFormValid(true)
        } else {
            setFormValid(false)
        }
    }, [firstName, lastName])

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault()
        setIsLoading(true)
        const { latitude, longitude } = await getUserLocation()
        await chrome.storage.sync.set({
            firstName,
            lastName,
            latitude,
            longitude,
        })
        setIsLoading(false)
        navigate('/')
    }

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
                <LoadingButton
                    variant="outlined"
                    color="primary"
                    className="mt-16"
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
