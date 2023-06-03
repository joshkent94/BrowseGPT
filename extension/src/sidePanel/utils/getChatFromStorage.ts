export const getChatFromStorage = async () => {
    const { chat } = await chrome.storage.sync.get()
    return chat
}
