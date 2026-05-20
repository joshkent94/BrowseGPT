import { getUserLocation } from '@shared/utils/user/getUserLocation'
import { useGptStore } from '@shared/utils/store'
import { trpc } from '@shared/utils/trpc'
import { FC, MouseEvent, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getGoogleAuthToken } from '@shared/utils/auth/google/getGoogleAuthToken'
import { getGoogleProfile } from '@shared/utils/auth/google/getGoogleProfile'
import { getCookies } from '@shared/utils/auth/getCookies'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
import FacebookIcon from '@mui/icons-material/Facebook'
import { getGithubAuthParams } from '@shared/utils/auth/github/getGithubAuthParams'
import { getGithubAccessToken } from '@shared/utils/auth/github/getGithubAccessToken'
import { getGithubProfile } from '@shared/utils/auth/github/getGithubProfile'
import { getFacebookAuthParams } from '@shared/utils/auth/facebook/getFacebookAuthParams'
import { getFacebookAccessToken } from '@shared/utils/auth/facebook/getFacebookAccessToken'
import { getFacebookProfile } from '@shared/utils/auth/facebook/getFacebookProfile'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import UrlPermissions from '@shared/components/auth/urlPermissions'

const SignUp: FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const { setUser, hasGrantedPermissions } = useGptStore()
    const oauthProviderRef = useRef<string>('')

    const showErrorToast = (message: string): void => {
        toast.error(message)
        setLoading(false)
    }

    const signUpMutation = trpc.signUp.useMutation({
        onSuccess: async (signedUpUser: User) => {
            const cookies = await getCookies({ name: 'browse-gpt' })
            setUser({
                ...signedUpUser,
                cookieValue: cookies[0]?.value,
            })
            window.pendo?.track('user_signed_up', {
                oauth_provider: oauthProviderRef.current,
                has_first_name: !!signedUpUser.firstName,
                has_email: !!signedUpUser.email,
                latitude: signedUpUser.latitude,
                longitude: signedUpUser.longitude,
            })
            setLoading(false)
            const { firstName } = signedUpUser
            if (firstName) navigate('/')
            else navigate('/profile')
        },
        onError: (error) => {
            window.pendo?.track('auth_failed', {
                oauth_provider: oauthProviderRef.current,
                auth_type: 'sign_up',
                error_message: error.message === 'User already exists'
                    ? error.message
                    : 'Failed to sign up',
            })
            if (error.message === 'User already exists')
                showErrorToast(error.message)
            else showErrorToast('Failed to sign up')
        },
    })

    const oauthSignUpGoogle = async (event: MouseEvent) => {
        event.preventDefault()
        setLoading(true)
        oauthProviderRef.current = 'google'

        const token = await getGoogleAuthToken()
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
        setLoading(true)
        oauthProviderRef.current = 'github'

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
        setLoading(true)
        oauthProviderRef.current = 'facebook'

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
            {loading ? (
                <CircularProgress />
            ) : hasGrantedPermissions ? (
                <>
                    <Button
                        onClick={(event: MouseEvent) =>
                            oauthSignUpGoogle(event)
                        }
                        variant="outlined"
                        color="primary"
                        className="my-2 w-56 bg-white"
                        sx={{ textTransform: 'none' }}
                    >
                        <GoogleIcon className="mr-2" />
                        <span className="grow">Sign up with Google</span>
                    </Button>
                    <Button
                        onClick={(event: MouseEvent) =>
                            oauthSignUpGithub(event)
                        }
                        variant="outlined"
                        color="primary"
                        className="my-2 w-56 bg-white"
                        sx={{ textTransform: 'none' }}
                    >
                        <GitHubIcon className="mr-2" />
                        <span className="grow">Sign up with GitHub</span>
                    </Button>
                    <Button
                        onClick={(event: MouseEvent) =>
                            oauthSignUpFacebook(event)
                        }
                        variant="outlined"
                        color="primary"
                        className="my-2 w-56 bg-white"
                        sx={{ textTransform: 'none' }}
                    >
                        <FacebookIcon className="mr-2" />
                        <span className="grow">Sign up with Facebook</span>
                    </Button>
                    <div className="mt-6 flex text-xs">
                        <span>Already have an account?</span>
                        <Link
                            to="/login"
                            className="ml-1 font-bold underline-offset-1 hover:underline"
                        >
                            Log In
                        </Link>
                    </div>
                </>
            ) : (
                <UrlPermissions />
            )}
        </div>
    )
}

export default SignUp
