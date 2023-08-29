import Navigation from '@components/navigation'
import { Button } from '@mui/material'
import { FC } from 'react'

const Heading: FC = () => {
    return (
        <div
            id="greeting"
            className="h-screen w-screen flex flex-col items-center"
        >
            <Navigation />
            <div className="grow flex flex-col justify-center items-center text-center">
                <h1 className="text-3xl sm:text-5xl font-bold mb-8 max-w-md">
                    The Ultimate AI Browser Assistant
                </h1>
                <h4 className="font-normal mb-8 text-lg">
                    Cross-platform. Non-intrusive. Always available.
                </h4>
                <Button
                    variant="outlined"
                    color="primary"
                    className="my-2 w-40 bg-white border-dark-blue hover:bg-light-blue p-0"
                    sx={{ textTransform: 'none' }}
                >
                    <a
                        href="#info"
                        title="Info"
                        className="h-full w-full text-dark-blue p-2"
                    >
                        Learn More
                    </a>
                </Button>
            </div>
        </div>
    )
}

export default Heading
