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

const UserDetails: FC = () => {
    const { user, setUser } = useGptStore()
    const navigate = useNavigate()
    const { firstName, lastName } = user
    const [localFirstName, setLocalFirstName] = useState<string>(firstName)
    const [firstNameValid, setFirstNameValid] = useState<boolean>(true)
    const [localLastName, setLocalLastName] = useState<string>(lastName)
    const [lastNameValid, setLastNameValid] = useState<boolean>(true)
    const [formValid, setFormValid] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const updateUserMutation = trpc.updateUserDetails.useMutation({
        onSuccess: (updatedUser: User) => {
            setUser({ ...user, ...updatedUser })
            setIsLoading(false)
            navigate('/chat')
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
        setLocalFirstName(firstName)
        setLocalLastName(lastName)
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
        updateUserMutation.mutate({
            ...user,
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
                className="flex h-[95%] w-5/6 flex-col items-center justify-center rounded-xl border border-midnight-blue border-opacity-30 bg-white"
                onSubmit={handleSubmit}
            >
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
                        },
                        '& .MuiOutlinedInput-root': {
                            color: 'text.primary',
                        },
                    }}
                />
                <LoadingButton
                    variant="outlined"
                    color="primary"
                    className="mt-16 w-32"
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
            </Box>
        </div>
    )
}

export default UserDetails
