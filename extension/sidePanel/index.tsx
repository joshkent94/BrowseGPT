import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpLink } from '@trpc/client'
import { trpc } from '@utils/trpc'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material'
import Conversation from '@pages/conversation'
import UserDetails from '@pages/userDetails'
import NotFound from '@pages/notFound'
import Layout from '@components/layout'
import '@styles/globals.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { useState } from 'react'
import { ChatsArrayContext, OpenChatContext } from '@utils/context'

const queryClient = new QueryClient()
const trpcClient = trpc.createClient({
    links: [
        httpLink({
            url:
                process.env.NODE_ENV === 'development'
                    ? 'http://localhost:3000/api'
                    : null, // to implement once backend is deployed
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
    const [chats, setChats] = useState([] as Chats)
    const [openChat, setOpenChat] = useState({} as Chat)

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={theme}>
                    <ChatsArrayContext.Provider value={chats}>
                        <OpenChatContext.Provider value={openChat}>
                            <BrowserRouter>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <Layout
                                                setChats={setChats}
                                                setOpenChat={setOpenChat}
                                            />
                                        }
                                    >
                                        <Route
                                            index
                                            element={
                                                <Conversation
                                                    setChats={setChats}
                                                    setOpenChat={setOpenChat}
                                                />
                                            }
                                        />
                                        <Route
                                            path="details"
                                            element={<UserDetails />}
                                        />
                                        <Route
                                            path="*"
                                            element={<NotFound />}
                                        />
                                    </Route>
                                </Routes>
                            </BrowserRouter>
                        </OpenChatContext.Provider>
                    </ChatsArrayContext.Provider>
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
