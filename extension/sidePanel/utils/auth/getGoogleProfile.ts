export const getGoogleProfile = async (token: string) => {
    const userInfo: chrome.identity.UserInfo = await new Promise(
        (resolve, reject) => {
            chrome.identity.getProfileUserInfo((userInfo) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve(userInfo)
                }
            })
        }
    )

    const response = await fetch(
        `https://people.googleapis.com/v1/people/me?personFields=names&key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
        {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
        }
    )

    if (response.ok) {
        const profile = await response.json()
        return {
            id: userInfo.id,
            email: userInfo.email,
            firstName: profile.names[0].givenName,
            lastName: profile.names[0].familyName,
            latitude: null,
            longitude: null,
        }
    }

    return null
}
