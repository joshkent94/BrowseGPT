import { getUserLocation } from '@shared/utils/user/getUserLocation'
import { useGptStore } from '@shared/utils/store'
import { trpc } from '@shared/utils/trpc'
import { FC, MouseEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getGoogleAuthToken } from '@shared/utils/auth/google/getGoogleAuthToken'
import { getGoogleProfile } from '@shared/utils/auth/google/getGoogleProfile'
import { getCookies } from '@shared/utils/auth/getCookies'
import GoogleIcon from '@mui/icons-material/Google'
import GitHubIcon from '@mui/icons-material/GitHub'
import FacebookIcon from '@mui/icons-material/Facebook'
import { getGithubAuthParams } from '@shared/utils/auth/github/getGithubAuthParams'
import { getGithubProfile } from '@shared/utils/auth/github/getGithubProfile'
import { getGithubAccessToken } from '@shared/utils/auth/github/getGithubAccessToken'
import { getFacebookAuthParams } from '@shared/utils/auth/facebook/getFacebookAuthParams'
import { getFacebookAccessToken } from '@shared/utils/auth/facebook/getFacebookAccessToken'
import { getFacebookProfile } from '@shared/utils/auth/facebook/getFacebookProfile'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import UrlPermissions from '@shared/components/auth/urlPermissions'

const Login: FC = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const { setUser, hasGrantedPermissions } = useGptStore()

    const showErrorToast = (message: string): void => {
        toast.error(message)
        setLoading(false)
    }

    const loginMutation = trpc.login.useMutation({
        onSuccess: async (loggedInUser: User) => {
            const cookies = await getCookies({ name: 'browse-gpt' })
            setUser({
                ...loggedInUser,
                cookieValue: cookies[0]?.value,
            })
            setLoading(false)
            navigate('/')
        },
        onError: (error) => {
            if (error.message === 'User does not exist')
                showErrorToast(error.message)
            else showErrorToast('Failed to log in')
        },
    })

    const oauthLoginGoogle = async (event: MouseEvent) => {
        event.preventDefault()
        setLoading(true)

        const token = await getGoogleAuthToken()
        if (!token) {
            showErrorToast('Failed to log in with Google')
            return
        }

        const user = await getGoogleProfile(token)
        if (!user) {
            showErrorToast('Failed to log in with Google')
            return
        }

        const { latitude, longitude } = await getUserLocation()
        loginMutation.mutate({
            id: user.id,
            latitude,
            longitude,
        })
    }

    const oauthLoginGithub = async (event: MouseEvent) => {
        event.preventDefault()
        setLoading(true)

        const { code, state } = await getGithubAuthParams()
        if (!code || !state || state !== process.env.REACT_APP_STATE_SECRET) {
            showErrorToast('Failed to log in with GitHub')
            return
        }

        const token = await getGithubAccessToken(code)
        if (!token) {
            showErrorToast('Failed to log in with GitHub')
            return
        }

        const user = await getGithubProfile(token)
        if (!user) {
            showErrorToast('Failed to log in with GitHub')
            return
        }

        const { latitude, longitude } = await getUserLocation()
        loginMutation.mutate({
            id: user.id.toString(),
            latitude,
            longitude,
        })
    }

    const oauthLoginFacebook = async (event: MouseEvent) => {
        event.preventDefault()
        setLoading(true)

        const { code, state } = await getFacebookAuthParams()
        if (!code || !state || state !== process.env.REACT_APP_STATE_SECRET) {
            showErrorToast('Failed to log in with Facebook')
            return
        }

        const token = await getFacebookAccessToken(code)
        if (!token) {
            showErrorToast('Failed to log in with Facebook')
            return
        }

        const user = await getFacebookProfile(token)
        if (!user) {
            showErrorToast('Failed to log in with Facebook')
            return
        }

        const { latitude, longitude } = await getUserLocation()
        loginMutation.mutate({
            id: user.id.toString(),
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
                        onClick={(event: MouseEvent) => {
                            oauthLoginGoogle(event)
                        }}
                        variant="outlined"
                        color="primary"
                        className="my-2 w-56 bg-white"
                        sx={{ textTransform: 'none' }}
                    >
                        <GoogleIcon className="mr-2" />
                        <span className="grow">Log in with Google</span>
                    </Button>
                    <Button
                        onClick={(event: MouseEvent) => oauthLoginGithub(event)}
                        variant="outlined"
                        color="primary"
                        className="my-2 w-56 bg-white"
                        sx={{ textTransform: 'none' }}
                    >
                        <GitHubIcon className="mr-2" />
                        <span className="grow">Log in with GitHub</span>
                    </Button>
                    <Button
                        onClick={(event: MouseEvent) =>
                            oauthLoginFacebook(event)
                        }
                        variant="outlined"
                        color="primary"
                        className="my-2 w-56 bg-white"
                        sx={{ textTransform: 'none' }}
                    >
                        <FacebookIcon className="mr-2" />
                        <span className="grow">Log in with Facebook</span>
                    </Button>
                    <div className="mt-6 flex text-xs">
                        <span>Don't have an account?</span>
                        <Link
                            to="/signup"
                            className="ml-1 font-bold underline-offset-1 hover:underline"
                        >
                            Sign Up
                        </Link>
                    </div>
                </>
            ) : (
                <UrlPermissions />
            )}
        </div>
    )
}

export default Login
