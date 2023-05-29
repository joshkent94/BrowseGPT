import React, { useEffect, useState } from 'react'
import { trpc } from '@utils/trpc'
import { useNavigate } from 'react-router-dom'
import { getDetailsFromStorage } from '@utils/getDetailsFromStorage'

const Home = () => {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState(null)
    const [apiKey, setApiKey] = useState(null)
    const greeting = trpc.greeting.useQuery(
        { firstName, apiKey },
        { enabled: !!(firstName && apiKey) }
    )

    useEffect(() => {
        getDetailsFromStorage().then(({ firstName, lastName, userAPIKey }) => {
            if (!firstName || !lastName || !userAPIKey) {
                navigate('/details')
            } else {
                setFirstName(firstName)
                setApiKey(userAPIKey)
            }
        })
    })

    return (
        <div className="h-full w-full bg-one">
            <div className="text-xl text-two">
                {greeting.data?.choices[0].text}
            </div>
        </div>
    )
}

export default Home
