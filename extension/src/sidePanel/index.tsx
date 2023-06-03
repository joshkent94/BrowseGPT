import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpLink } from '@trpc/client'
import { trpc } from '@utils/trpc'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserDetails from 'src/sidePanel/pages/userDetails'
import NotFound from 'src/sidePanel/pages/notFound'
import Layout from '@components/layout/layout'
import '@assets/globals.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import Conversation from '@pages/conversation'

const queryClient = new QueryClient()
const trpcClient = trpc.createClient({
    links: [
        httpLink({
            url: 'http://localhost:3000/api',
        }),
    ],
    transformer: undefined,
})
const theme = responsiveFontSizes(
    createTheme({
        palette: {
            primary: {
                main: '#0e1c36',
            },
            secondary: {
                main: '#afcbff',
            },
            text: {
                primary: '#afcbff',
                secondary: '#f9fbf2',
            },
        },
        typography: {
            fontFamily: 'quicksand',
        },
    })
)

const SidePanel = () => {
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<Conversation />} />
                                <Route
                                    path="details"
                                    element={<UserDetails />}
                                />
                                <Route path="*" element={<NotFound />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </ThemeProvider>
            </QueryClientProvider>
        </trpc.Provider>
    )
}

const init = () => {
    const appContainer = document.createElement('div')
    document.body.appendChild(appContainer)
    if (!appContainer) {
        throw new Error('Cannot find app container')
    }
    const root = createRoot(appContainer)
    root.render(<SidePanel />)
}

init()
