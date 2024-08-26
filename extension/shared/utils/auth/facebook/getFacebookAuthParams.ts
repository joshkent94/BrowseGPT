import browser from 'webextension-polyfill'
import { getBrowser } from '@shared/utils/auth/getBrowser'

declare interface FacebookAuthURLParams {
    code: string | null
    state: string | null
}

export const getFacebookAuthParams =
    async (): Promise<FacebookAuthURLParams> => {
        const browserName = getBrowser()

        try {
            if (browserName === 'chrome') {
                return new Promise((resolve, reject) => {
                    chrome.identity.launchWebAuthFlow(
                        {
                            interactive: true,
                            url: `https://www.facebook.com/v17.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&state=${process.env.REACT_APP_STATE_SECRET}&redirect_uri=https://ijdehllahgkhhcoffcohgmbebcchdknb.chromiumapp.org/callback`,
                        },
                        (redirectUrl) => {
                            if (chrome.runtime.lastError) {
                                reject(chrome.runtime.lastError)
                            } else {
                                const params = new URLSearchParams(
                                    redirectUrl.split('?')[1]
                                )
                                resolve({
                                    code: params.get('code'),
                                    state: params.get('state').slice(0, -4),
                                })
                            }
                        }
                    )
                })
            } else if (browserName === 'firefox' || browserName === 'edge') {
                const redirectUrl = browser.identity.getRedirectURL()
                const returnedUrl = await browser.identity.launchWebAuthFlow({
                    interactive: true,
                    url: `https://www.facebook.com/v17.0/dialog/oauth?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&state=${process.env.REACT_APP_STATE_SECRET}&redirect_uri=${redirectUrl}`,
                })
                const params = new URLSearchParams(returnedUrl.split('?')[1])
                return {
                    code: params.get('code'),
                    state: params.get('state').slice(0, -4),
                }
            }
        } catch (error) {
            console.error(error)
            return {
                code: '',
                state: '',
            }
        }
    }
