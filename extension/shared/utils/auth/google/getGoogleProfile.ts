import { getBrowser } from '@shared/utils/auth/getBrowser'

export const getGoogleProfile = async (token: string): Promise<User> => {
    const browserName = getBrowser()

    if (browserName === 'chrome') {
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
            `https://people.googleapis.com/v1/people/me?personFields=names&key=${process.env.REACT_APP_GOOGLE_PEOPLE_API_KEY}`,
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
                firstName: profile.names[0].givenName.split(' ')[0],
                lastName: profile.names[0].familyName.split(' ')[0],
                latitude: null,
                longitude: null,
            }
        }

        return null
    } else if (browserName === 'firefox') {
        const response = await fetch(
            `https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses&key=${process.env.REACT_APP_GOOGLE_PEOPLE_API_KEY}`,
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
                id: profile.resourceName.split('/')[1],
                email: profile?.emailAddresses[0]?.value,
                firstName: profile.names[0].givenName.split(' ')[0],
                lastName: profile.names[0].familyName.split(' ')[0],
                latitude: null,
                longitude: null,
            }
        }

        return null
    }
}
