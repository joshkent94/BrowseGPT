export const sendChatsToStorage = async (
    chats: Chat[],
    openChat: Chat,
    setChats: (chats: Chat[]) => void
) => {
    let chatsToSend = []
    if (chats.find((chat) => chat.id === openChat.id)) {
        chatsToSend = chats.map((chat) => {
            if (chat.id === openChat.id) {
                return {
                    ...chat,
                    isOpen: true,
                    messages: openChat.messages,
                }
            } else {
                return { ...chat, isOpen: false }
            }
        })
    } else {
        chatsToSend = chats
            .map((chat) => {
                return { ...chat, isOpen: false }
            })
            .concat([openChat])
    }
    setChats(chatsToSend)
    await chrome.storage.sync.set({ chats: chatsToSend })
}
