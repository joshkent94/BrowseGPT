import {
    cleanUpPendoScript,
    loadPendoScript,
} from '@shared/utils/loadPendoScript'
import { useGptStore } from '@shared/utils/store'
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
    const devTransforms = [
        {
            attr: 'hostname',
            action: 'Replace',
            data: 'browsegpt-dev.com',
        },
    ]
    const prodTransforms = [
        {
            attr: 'hostname',
            action: 'Replace',
            data: 'browsegpt-prod.com',
        },
    ]

    useEffect(() => {
        if (!window.pendo) {
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
                    location: {
                        transforms:
                            process.env.NODE_ENV === 'production'
                                ? prodTransforms
                                : devTransforms,
                    },
                })
            })

            return () => {
                cleanUpPendoScript()
            }
        }

        window.pendo?.updateOptions({
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
    }, [])

    return <Outlet />
}

export default Pendo
