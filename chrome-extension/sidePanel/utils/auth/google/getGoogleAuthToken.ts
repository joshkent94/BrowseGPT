const getGoogleAuthToken = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(token)
            }
        })
    })
}

export const googleAuthToken = await getGoogleAuthToken()
