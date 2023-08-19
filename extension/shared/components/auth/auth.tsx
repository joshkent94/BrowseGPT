import { useGptStore } from '@shared/utils/store'
import { FC, useLayoutEffect } from 'react'
import { useLocation, useNavigate, useOutlet } from 'react-router-dom'
import browser from 'webextension-polyfill'

const Auth: FC = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const outlet = useOutlet()
    const { user, setHasGrantedPermissions } = useGptStore()

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

    useLayoutEffect(() => {
        const setHasAllUrlsPermission = async () => {
            const permissions = await browser.permissions.getAll()
            if (permissions.origins.indexOf('<all_urls>') > -1) {
                setHasGrantedPermissions(true)
            } else {
                setHasGrantedPermissions(false)
            }
        }

        setHasAllUrlsPermission()
    })

    return outlet
}

export default Auth
