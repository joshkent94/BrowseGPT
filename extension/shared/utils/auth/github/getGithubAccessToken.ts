import browser from 'webextension-polyfill'
import { getBrowser } from '@shared/utils/auth/getBrowser'

export const getGithubAccessToken = async (code: string) => {
    const browserName = getBrowser()
    let response: any

    if (browserName === 'chrome') {
        response = await fetch(
            `https://github.com/login/oauth/access_token?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID_CHROME}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET_CHROME}&code=${code}`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            }
        )
    } else if (browserName === 'firefox') {
        const redirectUrl = browser.identity.getRedirectURL()
        response = await fetch(
            `https://github.com/login/oauth/access_token?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID_FIREFOX}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET_FIREFOX}&code=${code}&redirect_uri=${redirectUrl}`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            }
        )
    }

    if (response.ok) {
        const jsonResponse = await response.json()
        return jsonResponse.access_token
    }

    return null
}
