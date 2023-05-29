import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpLink } from '@trpc/client'
import { trpc } from '@utils/trpc'
import Home from './home'
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UserDetails from './userDetails'
import NotFound from './notFound'
import Layout from './layout/layout'

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
                                <Route index element={<Home />} />
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

export default SidePanel
