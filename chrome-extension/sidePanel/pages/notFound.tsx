import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound: FC = () => {
    const navigate = useNavigate()

    useEffect(() => {
        navigate('/login')
    })

    return null
}

export default NotFound
