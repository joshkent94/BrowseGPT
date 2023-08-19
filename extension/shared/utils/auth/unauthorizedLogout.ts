import { resetStore, useGptStore } from '@shared/utils/store'

export const unauthorizedLogout = () => {
    resetStore()
    useGptStore.persist.clearStorage()
}
