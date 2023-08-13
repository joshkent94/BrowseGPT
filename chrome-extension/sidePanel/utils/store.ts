import { create, StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'

const resetters: (() => void)[] = []

interface UserSlice {
    user: User
    isLoggingOut: boolean
    setUser: (user: User) => void
    setIsLoggingOut: (isLoggingOut: boolean) => void
    resetUser: () => void
}

const initialUserState = {
    user: {
        id: '' as string,
        email: '' as string,
        firstName: '' as string,
        lastName: '' as string,
        latitude: 0 as number,
        longitude: 0 as number,
        cookieValue: '' as string,
    },
    isLoggingOut: false as boolean,
}

const createUserSlice: StateCreator<
    UserSlice & ChatSlice,
    [],
    [],
    UserSlice
> = (set) => {
    resetters.push(() => set(initialUserState))
    return {
        ...initialUserState,
        setUser: (user: User) => set({ user }),
        setIsLoggingOut: (isLoggingOut: boolean) => set({ isLoggingOut }),
        resetUser: () => set({ user: {} as User }),
    }
}

interface ChatSlice {
    openChat: Chat
    userChats: Chats
    isStartingChat: boolean
    setOpenChat: (chat: Chat) => void
    setUserChats: (chats: Chats) => void
    setIsStartingChat: (isStartingChat: boolean) => void
    resetChats: () => void
}

const initialChatState = {
    openChat: {} as Chat,
    userChats: [] as Chats,
    isStartingChat: false as boolean,
}

const createChatSlice: StateCreator<
    UserSlice & ChatSlice,
    [],
    [],
    ChatSlice
> = (set) => {
    resetters.push(() => set(initialChatState))
    return {
        ...initialChatState,
        setOpenChat: (openChat: Chat) => set({ openChat }),
        setUserChats: (userChats: Chats) => set({ userChats }),
        setIsStartingChat: (isStartingChat: boolean) => set({ isStartingChat }),
        resetChats: () => set({ openChat: {} as Chat, userChats: [] as Chats }),
    }
}

export const useGptStore = create<UserSlice & ChatSlice>()(
    persist(
        (...params) => ({
            ...createUserSlice(...params),
            ...createChatSlice(...params),
        }),
        {
            name: 'browse-gpt-storage',
        }
    )
)

export const resetStore = () => resetters.forEach((resetter) => resetter())
