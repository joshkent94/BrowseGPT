import browser from 'webextension-polyfill'
import { getBrowser } from '@shared/utils/auth/getBrowser'

export const getFacebookAccessToken = async (code: string) => {
    const browserName = getBrowser()
    let response: any

    if (browserName === 'chrome') {
        response = await fetch(
            `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&client_secret=${process.env.REACT_APP_FACEBOOK_CLIENT_SECRET}&code=${code}&redirect_uri=https://ijdehllahgkhhcoffcohgmbebcchdknb.chromiumapp.org/callback`
        )
    } else if (browserName === 'firefox' || browserName === 'edge') {
        const redirectUrl = browser.identity.getRedirectURL()
        response = await fetch(
            `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&client_secret=${process.env.REACT_APP_FACEBOOK_CLIENT_SECRET}&code=${code}&redirect_uri=${redirectUrl}`
        )
    }

    if (response.ok) {
        const jsonResponse = await response.json()
        return jsonResponse.access_token
    }

    return null
}
