import { resetStore, useGptStore } from '@utils/store'

export const unauthorizedLogout = () => {
    resetStore()
    useGptStore.persist.clearStorage()
}
