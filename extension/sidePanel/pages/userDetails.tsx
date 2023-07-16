import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import Box from '@mui/system/Box'
import { getUserLocation } from '@utils/user/getUserLocation'
import { useGptStore } from '@utils/store'
import { trpc } from '@utils/trpc'
import { ChangeEvent, FC, SyntheticEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { unauthorizedLogout } from '@utils/auth/unauthorizedLogout'
import { Typography } from '@mui/material'

const UserDetails: FC = () => {
    const { user, setUser } = useGptStore()
    const navigate = useNavigate()
    const { firstName, lastName, email } = user
    const [localFirstName, setLocalFirstName] = useState<string>(firstName)
    const [firstNameValid, setFirstNameValid] = useState<boolean>(true)
    const [localLastName, setLocalLastName] = useState<string>(lastName)
    const [lastNameValid, setLastNameValid] = useState<boolean>(true)
    const [localEmail, setLocalEmail] = useState<string>(email)
    const [emailValid, setEmailValid] = useState<boolean>(true)
    const [formValid, setFormValid] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const updateUserMutation = trpc.updateUserDetails.useMutation({
        onSuccess: (updatedUser: User) => {
            setUser({ ...user, ...updatedUser })
            setIsLoading(false)
            navigate('/')
            toast.success('Successfully updated user details')
        },
        onError: (error) => {
            setIsLoading(false)
            if (error.data?.httpStatus === 401) {
                unauthorizedLogout()
                navigate('/login', {
                    replace: true,
                })
            } else {
                toast.error('Failed to update user details')
            }
        },
    })

    useEffect(() => {
        const namePattern = /^[a-zA-Z0-9!@#$%^&*)(+=._-]{1,60}$/
        const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
        namePattern.test(localFirstName)
            ? setFirstNameValid(true)
            : setFirstNameValid(false)
        namePattern.test(localLastName)
            ? setLastNameValid(true)
            : setLastNameValid(false)
        emailPattern.test(localEmail)
            ? setEmailValid(true)
            : setEmailValid(false)
        if (
            localFirstName.length &&
            firstNameValid &&
            localLastName.length &&
            lastNameValid &&
            localEmail.length &&
            emailValid
        ) {
            setFormValid(true)
        } else {
            setFormValid(false)
        }
    }, [localFirstName, localLastName, localEmail])

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault()
        setIsLoading(true)
        const { latitude, longitude } = await getUserLocation()
        updateUserMutation.mutate({
            email: localEmail,
            firstName: localFirstName,
            lastName: localLastName,
            latitude,
            longitude,
        })
    }

    return (
        <div className="flex h-full w-full items-center justify-center bg-light-blue">
            <Box
                component="form"
                className="flex h-[95%] w-5/6 flex-col items-center rounded-xl border border-midnight-blue border-opacity-30 bg-white"
                onSubmit={handleSubmit}
            >
                <Typography variant="h6" className="mt-16">
                    Profile
                </Typography>
                <div className="flex grow flex-col items-center justify-center">
                    <TextField
                        id="first-name-input"
                        label="First Name"
                        value={localFirstName}
                        error={!firstNameValid}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setLocalFirstName(event.target.value)
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
                                fontSize: '14px',
                            },
                            '& .MuiOutlinedInput-root': {
                                color: 'text.primary',
                            },
                            '& .MuiInputBase-input': {
                                padding: '12px 14px',
                                fontSize: '14px',
                            },
                            '& .MuiInputLabel-formControl': {
                                transform: 'translate(14px, 12px) scale(1)',
                            },
                            '& .MuiInputLabel-outlined.Mui-focused': {
                                transform: 'translate(14px, -9px) scale(0.75)',
                            },
                            '& .MuiInputLabel-outlined.MuiFormLabel-filled': {
                                transform: 'translate(14px, -9px) scale(0.75)',
                            },
                        }}
                    />
                    <TextField
                        id="last-name-input"
                        label="Last Name"
                        className="mt-9"
                        value={localLastName}
                        error={!lastNameValid}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setLocalLastName(event.target.value)
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
                                fontSize: '14px',
                            },
                            '& .MuiOutlinedInput-root': {
                                color: 'text.primary',
                            },
                            '& .MuiInputBase-input': {
                                padding: '12px 14px',
                                fontSize: '14px',
                            },
                            '& .MuiInputLabel-formControl': {
                                transform: 'translate(14px, 12px) scale(1)',
                            },
                            '& .MuiInputLabel-outlined.Mui-focused': {
                                transform: 'translate(14px, -9px) scale(0.75)',
                            },
                            '& .MuiInputLabel-outlined.MuiFormLabel-filled': {
                                transform: 'translate(14px, -9px) scale(0.75)',
                            },
                        }}
                    />
                    <TextField
                        id="email-input"
                        label="Email"
                        className="mt-9"
                        value={localEmail}
                        error={!emailValid}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setLocalEmail(event.target.value)
                        }}
                        color="primary"
                        required
                        autoComplete="off"
                        placeholder="john.smith@example.com"
                        variant="outlined"
                        sx={{
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
                                padding: '12px 14px',
                                fontSize: '14px',
                            },
                            '& .MuiInputLabel-formControl': {
                                transform: 'translate(14px, 12px) scale(1)',
                            },
                            '& .MuiInputLabel-outlined.Mui-focused': {
                                transform: 'translate(14px, -9px) scale(0.75)',
                            },
                            '& .MuiInputLabel-outlined.MuiFormLabel-filled': {
                                transform: 'translate(14px, -9px) scale(0.75)',
                            },
                        }}
                    />
                    <LoadingButton
                        variant="outlined"
                        color="primary"
                        className="mt-12 w-32"
                        type="submit"
                        sx={{
                            width: 120,
                            textTransform: 'none',
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
                </div>
            </Box>
        </div>
    )
}

export default UserDetails
