import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import Box from '@mui/system/Box'
import { getUserLocation } from '@shared/utils/user/getUserLocation'
import { useGptStore } from '@shared/utils/store'
import { trpc } from '@shared/utils/trpc'
import { ChangeEvent, FC, SyntheticEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { unauthorizedLogout } from '@shared/utils/auth/unauthorizedLogout'
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
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const updateUserMutation = trpc.updateUserDetails.useMutation({
        onSuccess: (updatedUser: User) => {
            setUser({ ...user, ...updatedUser })
            setIsLoading(false)
            window.pendo?.updateOptions({
                visitor: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    full_name: `${updatedUser.firstName} ${updatedUser.lastName}`,
                },
                account: {
                    id: updatedUser.id,
                    name: updatedUser.email,
                },
            })
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
        namePattern.test(localFirstName)
            ? setFirstNameValid(true)
            : setFirstNameValid(false)
    }, [localFirstName])

    useEffect(() => {
        const namePattern = /^[a-zA-Z0-9!@#$%^&*)(+=._-]{1,60}$/
        namePattern.test(localLastName)
            ? setLastNameValid(true)
            : setLastNameValid(false)
        localLastName.length === 0 && setLastNameValid(true)
    }, [localLastName])

    useEffect(() => {
        const emailPattern =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        emailPattern.test(localEmail)
            ? setEmailValid(true)
            : setEmailValid(false)
        localEmail.length === 0 && setEmailValid(true)
    }, [localEmail])

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
                className="flex h-[calc(100%-30px)] w-[calc(100%-80px)] flex-col items-center justify-center rounded-xl border border-midnight-blue border-opacity-30 bg-white"
                onSubmit={handleSubmit}
            >
                <Typography variant="h6" className="mb-12 text-lg">
                    Profile
                </Typography>
                <div className="flex flex-col items-center">
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
                            '@media (max-width: 360px)': {
                                width: '200px',
                            },
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
                                opacity: 0.5,
                            },
                            '& .MuiInputLabel-shrink': {
                                opacity: 1,
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
                        autoComplete="off"
                        placeholder="Smith"
                        variant="outlined"
                        sx={{
                            width: 240,
                            '@media (max-width: 360px)': {
                                width: '200px',
                            },
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
                                opacity: 0.5,
                            },
                            '& .MuiInputLabel-shrink': {
                                opacity: 1,
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
                        autoComplete="off"
                        placeholder="john.smith@example.com"
                        variant="outlined"
                        sx={{
                            width: 240,
                            '@media (max-width: 360px)': {
                                width: '200px',
                            },
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
                                opacity: 0.5,
                            },
                            '& .MuiInputLabel-shrink': {
                                opacity: 1,
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
                        disabled={
                            !firstNameValid || !lastNameValid || !emailValid
                        }
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
