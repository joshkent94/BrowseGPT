export type Command = {
    name: string
    description: string
    value: string
}

export const commands: Command[] = [
    {
        name: 'Amazon',
        description: 'Buy an item',
        value: '/amazon',
    },
    {
        name: 'Google',
        description: 'Quickly Google something',
        value: '/google',
    },
    {
        name: 'YouTube',
        description: 'Watch your favorite videos',
        value: '/youtube',
    },
    {
        name: 'Wikipedia',
        description: 'Learn something new',
        value: '/wikipedia',
    },
    {
        name: 'Reddit',
        description: 'Discuss your favorite topics',
        value: '/reddit',
    },
    {
        name: 'Spotify',
        description: 'Discover new music',
        value: '/spotify',
    },
    {
        name: 'Ebay',
        description: 'Find great deals',
        value: '/ebay',
    },
]
