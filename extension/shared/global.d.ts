declare module '*.png'
declare module '*.jpg'

declare type User = {
    id: string
    email: string
    firstName: string
    lastName: string
    latitude: number | null
    longitude: number | null
    cookieValue?: string
}

declare type Chat = {
    id: string
    isOpen: boolean
    messages: Message[]
}

declare type Chats = Chat[]

declare type Message = {
    content: string
    role: 'user' | 'assistant' | 'system'
    url?: string | null
    isCommand?: boolean
}
