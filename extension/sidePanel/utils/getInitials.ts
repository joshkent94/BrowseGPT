export const getInitials = (names: string[]): string => {
    return names
        .map((name: string): string => {
            return name.charAt(0).toUpperCase()
        })
        .join('')
}
