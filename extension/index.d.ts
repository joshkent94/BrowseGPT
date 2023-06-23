declare module '*.png'
declare module '*.jpg'

declare type Chats = Chat[]

declare interface Chat {
    id: string
    isOpen: boolean
    messages: Message[]
}

declare interface Message {
    content: string
    role: 'user' | 'assistant'
}
