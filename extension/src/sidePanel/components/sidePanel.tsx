import React, { useState, useEffect } from 'react'

const SidePanel = () => {
    const [response, setResponse] = useState('Some string')

    useEffect(() => {
        const getReply = async () => {
            const reply = await fetch('http://localhost:3000/api/conversation')
            const json = await reply.json()
            setResponse(json.choices[0].text)
        }

        getReply()
    }, [])

    return (
        <div className="h-full w-full bg-one">
            <div className="text-xl text-two">{response}</div>
        </div>
    )
}

export default SidePanel
