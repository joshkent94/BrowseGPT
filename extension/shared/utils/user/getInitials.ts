export const getInitials = (names: string[]): string => {
    return names
        .map((name: string): string => {
            if (!name || name.length === 0) return ''
            return name.charAt(0).toUpperCase()
        })
        .join('')
}
