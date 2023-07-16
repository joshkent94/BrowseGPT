export const getGithubProfile = async (token: string): Promise<User> => {
    const response = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })

    if (response.ok) {
        const profile = await response.json()
        return {
            id: profile.id.toString(),
            email: profile.email,
            firstName: profile.name,
            lastName: null,
            latitude: null,
            longitude: null,
        }
    }

    return null
}
