export const getChatsFromStorage = async (): Promise<Chats> => {
    const { chats } = await chrome.storage.sync.get()
    return chats || []
}
