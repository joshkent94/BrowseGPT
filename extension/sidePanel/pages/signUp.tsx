import LoadingButton from '@mui/lab/LoadingButton/LoadingButton'
import { getUserLocation } from '@utils/user/getUserLocation'
import { useGptStore } from '@utils/store'
import { trpc } from '@utils/trpc'
import { FC, MouseEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { googleAuthToken } from '@utils/auth/google/getGoogleAuthToken'
import { getGoogleProfile } from '@utils/auth/google/getGoogleProfile'
import { getCookies } from '@utils/auth/getCookies'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
import FacebookIcon from '@mui/icons-material/Facebook'
import { getGithubAuthParams } from '@utils/auth/github/getGithubAuthParams'
import { getGithubAccessToken } from '@utils/auth/github/getGithubAccessToken'
import { getGithubProfile } from '@utils/auth/github/getGithubProfile'
import { getFacebookAuthParams } from '@utils/auth/facebook/getFacebookAuthParams'
import { getFacebookAccessToken } from '@utils/auth/facebook/getFacebookAccessToken'
import { getFacebookProfile } from '@utils/auth/facebook/getFacebookProfile'

const SignUp: FC = () => {
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
    const [isGithubLoading, setIsGithubLoading] = useState<boolean>(false)
    const [isFacebookLoading, setIsFacebookLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const { setUser } = useGptStore()

    const stopLoading = (): void => {
        setIsGoogleLoading(false)
        setIsGithubLoading(false)
        setIsFacebookLoading(false)
    }

    const showErrorToast = (message: string): void => {
        toast.error(message)
        stopLoading()
    }

    const signUpMutation = trpc.signUp.useMutation({
        onSuccess: async (signedUpUser: User) => {
            const cookies = await getCookies({ name: 'browse-gpt' })
            setUser({
                ...signedUpUser,
                cookieValue: cookies[0]?.value,
            })
            stopLoading()
            const { firstName, lastName, email } = signedUpUser
            if (firstName && lastName && email) navigate('/')
            else navigate('/details')
        },
        onError: (error) => {
            if (error.message === 'User already exists')
                showErrorToast(error.message)
            else showErrorToast('Failed to sign up')
        },
    })

    const oauthSignUpGoogle = async (event: MouseEvent) => {
        event.preventDefault()
        setIsGoogleLoading(true)

        const token = googleAuthToken
        if (!token) {
            showErrorToast('Failed to sign up with Google')
            return
        }

        const user = await getGoogleProfile(token)
        if (!user) {
            showErrorToast('Failed to sign up with Google')
            return
        }

        const { latitude, longitude } = await getUserLocation()
        signUpMutation.mutate({
            ...user,
            latitude,
            longitude,
        })
    }

    const oauthSignUpGithub = async (event: MouseEvent) => {
        event.preventDefault()
        setIsGithubLoading(true)

        const { code, state } = await getGithubAuthParams()
        if (!code || !state || state !== process.env.REACT_APP_STATE_SECRET) {
            showErrorToast('Failed to sign up with GitHub')
            return
        }

        const token = await getGithubAccessToken(code)
        if (!token) {
            showErrorToast('Failed to sign up with GitHub')
            return
        }

        const user = await getGithubProfile(token)
        if (!user) {
            showErrorToast('Failed to sign up with GitHub')
            return
        }

        const { latitude, longitude } = await getUserLocation()
        signUpMutation.mutate({
            ...user,
            latitude,
            longitude,
        })
    }

    const oauthSignUpFacebook = async (event: MouseEvent) => {
        event.preventDefault()
        setIsFacebookLoading(true)

        const { code, state } = await getFacebookAuthParams()
        if (!code || !state || state !== process.env.REACT_APP_STATE_SECRET) {
            showErrorToast('Failed to sign up with Facebook')
            return
        }

        const token = await getFacebookAccessToken(code)
        if (!token) {
            showErrorToast('Failed to sign up with Facebook')
            return
        }

        const user = await getFacebookProfile(token)
        if (!user) {
            showErrorToast('Failed to sign up with Facebook')
            return
        }

        const { latitude, longitude } = await getUserLocation()
        signUpMutation.mutate({
            ...user,
            latitude,
            longitude,
        })
    }

    return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-light-blue">
            <LoadingButton
                onClick={(event: MouseEvent) => oauthSignUpGoogle(event)}
                loading={isGoogleLoading}
                variant="outlined"
                color="primary"
                className="my-2 w-56 bg-white"
                sx={{ textTransform: 'none' }}
            >
                <GoogleIcon className="mr-2" />
                <span className="grow">Sign up with Google</span>
            </LoadingButton>
            <LoadingButton
                onClick={(event: MouseEvent) => oauthSignUpGithub(event)}
                loading={isGithubLoading}
                variant="outlined"
                color="primary"
                className="my-2 w-56 bg-white"
                sx={{ textTransform: 'none' }}
            >
                <GitHubIcon className="mr-2" />
                <span className="grow">Sign up with GitHub</span>
            </LoadingButton>
            <LoadingButton
                onClick={(event: MouseEvent) => oauthSignUpFacebook(event)}
                loading={isFacebookLoading}
                variant="outlined"
                color="primary"
                className="my-2 w-56 bg-white"
                sx={{ textTransform: 'none' }}
            >
                <FacebookIcon className="mr-2" />
                <span className="grow">Sign up with Facebook</span>
            </LoadingButton>
            <div className="mt-6 flex">
                <span>Already have an account?</span>
                <Link
                    to="/login"
                    className="ml-1 font-bold underline-offset-1 hover:underline"
                >
                    Log In
                </Link>
            </div>
        </div>
    )
}

export default SignUp
