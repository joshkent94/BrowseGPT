import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpLink } from '@trpc/client'
import { trpc } from '@utils/trpc'
import Home from './home'

const queryClient = new QueryClient()
const trpcClient = trpc.createClient({
    links: [
        httpLink({
            url: 'http://localhost:3000/api',
        }),
    ],
    transformer: undefined,
})

const SidePanel = () => {
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <Home />
            </QueryClientProvider>
        </trpc.Provider>
    )
}

export default SidePanel
