import { Link } from 'react-router-dom'

const ChatError = () => {
    return (
        <div className="w-3/4 text-center text-base text-dark-blue">
            There was an error connecting to BrowseGPT, please check your{' '}
            <Link to="/details" className="font-semibold underline">
                API key
            </Link>{' '}
            and retry.
        </div>
    )
}

export default ChatError
