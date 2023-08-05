import { FC } from 'react'

const ChatError: FC = () => {
    return (
        <div className="w-3/4 text-center text-base text-dark-blue">
            There was an error connecting to BrowseGPT, please refresh and try
            again.
        </div>
    )
}

export default ChatError
