import { useGptStore } from '@utils/store'
import { FC, useLayoutEffect } from 'react'
import { useLocation, useNavigate, useOutlet } from 'react-router-dom'

const Auth: FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const outlet = useOutlet()
    const { user } = useGptStore()

    useLayoutEffect(() => {
        const isLoggedIn = !!user.cookieValue
        if (location.pathname === '/login' || location.pathname === '/signup') {
            isLoggedIn && navigate('/', { replace: true })
        } else {
            !isLoggedIn &&
                navigate('/login', {
                    replace: true,
                })
        }
    }, [location.pathname])

    return outlet
}

export default Auth
