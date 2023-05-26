import { trpc } from '@utils/trpc'
import React from 'react'

const Home = () => {
    const greeting = trpc.greeting.useQuery()

    return (
        <div className="h-full w-full bg-one">
            <div className="text-xl text-two">{greeting.data?.choices[0].text}</div>
        </div>
    )
}

export default Home
