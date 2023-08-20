export const getFacebookProfile = async (token: string): Promise<User> => {
    const idResponse = await fetch(
        `https://graph.facebook.com/v17.0/me?fields=id&access_token=${token}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )

    if (!idResponse.ok) {
        return null
    }

    const { id } = await idResponse.json()

    const userResponse = await fetch(
        `https://graph.facebook.com/v17.0/${id}?access_token=${token}&fields=id,first_name,last_name,email`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    )

    if (!userResponse.ok) {
        return null
    }

    const { first_name, last_name, email } = await userResponse.json()

    return {
        id,
        email: email || '',
        firstName: first_name.split(' ')[0] || '',
        lastName: last_name.split(' ')[0] || '',
        latitude: null,
        longitude: null,
    }
}
