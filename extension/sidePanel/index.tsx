import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { trpc } from '@utils/trpc'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material'
import { FC } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@utils/router'
import '@styles/globals.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import 'react-toastify/dist/ReactToastify.css'
import Toast from '@components/layout/toast'

const queryClient = new QueryClient()
const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url:
                process.env.NODE_ENV === 'development'
                    ? 'http://localhost:3000/api'
                    : 'https://browse-gpt-server-925113585525.herokuapp.com/api',
            fetch(url, options) {
                return fetch(url, {
                    ...options,
                    credentials: 'include',
                    mode: 'cors',
                })
            },
        }),
    ],
    transformer: undefined,
})
const theme = responsiveFontSizes(
    createTheme({
        palette: {
            primary: {
                main: 'rgb(14, 28, 54)',
            },
            secondary: {
                main: 'rgb(230, 239, 255)',
            },
            text: {
                primary: 'rgb(14, 28, 54)',
                secondary: 'rgb(255, 255, 255)',
            },
        },
        typography: {
            fontFamily: 'quicksand',
        },
    })
)

const SidePanel: FC = () => {
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <RouterProvider router={router} />
                    <Toast />
                </ThemeProvider>
            </QueryClientProvider>
        </trpc.Provider>
    )
}

const init = () => {
    const appContainer = document.createElement('div')
    document.body.appendChild(appContainer)
    const root = createRoot(appContainer)
    root.render(<SidePanel />)
}

init()
