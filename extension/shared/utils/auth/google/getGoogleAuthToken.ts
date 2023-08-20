import browser from 'webextension-polyfill'
import { getBrowser } from '@shared/utils/auth/getBrowser'

export const getGoogleAuthToken = async (): Promise<string> => {
    const browserName = getBrowser()

    if (browserName === 'chrome') {
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve(token)
                }
            })
        })
    } else if (browserName === 'firefox') {
        const redirectUrl =
            'http://127.0.0.1/mozoauth2/0b27ac2676056462b492c4301381b40613ddeaaf'
        const returnedUrl = await browser.identity.launchWebAuthFlow({
            interactive: true,
            url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID_FIREFOX}&redirect_uri=${redirectUrl}&response_type=token&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&state=${process.env.REACT_APP_STATE_SECRET}`,
        })

        const params = new URLSearchParams(returnedUrl.split('#')[1])
        const token = params.get('access_token')
        const state = params.get('state')

        if (state === process.env.REACT_APP_STATE_SECRET) return token
        return null
    }
}
