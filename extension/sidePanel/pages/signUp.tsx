import LoadingButton from '@mui/lab/LoadingButton/LoadingButton'
import { getUserLocation } from '@utils/user/getUserLocation'
import { useGptStore } from '@utils/store'
import { trpc } from '@utils/trpc'
import { FC, MouseEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { googleAuthToken } from '@utils/auth/getGoogleAuthToken'
import { getGoogleProfile } from '@utils/auth/getGoogleProfile'
import { getCookies } from '@utils/auth/getCookies'
import GoogleIcon from '@mui/icons-material/Google'

const SignUp: FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const { setUser } = useGptStore()

    const signUpMutation = trpc.signUp.useMutation({
        onSuccess: async (signedUpUser: User) => {
            const cookies = await getCookies({ name: 'browse-gpt' })
            setUser({
                ...signedUpUser,
                cookieValue: cookies[0]?.value,
            })
            setIsLoading(false)
            navigate('/chat')
        },
        onError: (error) => {
            if (error.message === 'User already exists')
                toast.error(error.message)
            else toast.error('Failed to sign up')
            setIsLoading(false)
        },
    })

    const oauthSignUpGoogle = async (event: MouseEvent) => {
        event.preventDefault()
        setIsLoading(true)
        const token = googleAuthToken
        const user = await getGoogleProfile(token)
        if (user) {
            const { latitude, longitude } = await getUserLocation()
            signUpMutation.mutate({
                ...user,
                latitude,
                longitude,
            })
        } else {
            toast.error('Failed to sign up with Google')
        }
    }

    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-light-blue">
            <LoadingButton
                onClick={(event: MouseEvent) => oauthSignUpGoogle(event)}
                loading={isLoading}
                variant="outlined"
                color="primary"
                className="w-56 bg-white"
                sx={{ textTransform: 'none' }}
            >
                <GoogleIcon className="mr-4" />
                Sign Up With Google
            </LoadingButton>
            <div className="mt-6 flex">
                <span>Already have an account?</span>
                <Link
                    to="/login"
                    className="ml-1 font-bold underline-offset-2 hover:underline"
                >
                    Log In
                </Link>
            </div>
        </div>
    )
}

export default SignUp
