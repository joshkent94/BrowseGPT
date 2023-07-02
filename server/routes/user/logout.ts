import { procedure } from '@utils/trpc'

const logout = procedure.mutation(({ ctx }) => {
    const { session, res } = ctx
    res.clearCookie('browse-gpt', { path: '/' })
    session?.destroy(() => {
        res.send()
    })
})

export { logout }
