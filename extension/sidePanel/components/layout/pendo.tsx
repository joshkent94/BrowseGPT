import {
    cleanUpPendoScript,
    loadPendoScript,
} from '@utils/misc/loadPendoScript'
import { useGptStore } from '@utils/store'
import { FC, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

declare global {
    interface Window {
        pendo: any
    }
}

const Pendo: FC = () => {
    const { user } = useGptStore()
    const { id, firstName, lastName, email } = user

    useEffect(() => {
        loadPendoScript().then(() => {
            window.pendo?.initialize({
                visitor: {
                    id,
                    email,
                    full_name: `${firstName} ${lastName}`,
                },
                account: {
                    id,
                    name: email,
                },
            })
        })

        return () => {
            cleanUpPendoScript()
        }
    }, [id, firstName, lastName, email])

    return <Outlet />
}

export default Pendo
