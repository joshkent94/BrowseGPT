import browser from 'webextension-polyfill'
import { getBrowser } from '@shared/utils/auth/getBrowser'

declare interface GithubAuthURLParams {
    code: string | null
    state: string | null
}

export const getGithubAuthParams = async (): Promise<GithubAuthURLParams> => {
    const browserName = getBrowser()

    try {
        if (browserName === 'chrome') {
            return new Promise((resolve, reject) => {
                chrome.identity.launchWebAuthFlow(
                    {
                        interactive: true,
                        url: `https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID_CHROME}&state=${process.env.REACT_APP_STATE_SECRET}`,
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
                                state: params.get('state'),
                            })
                        }
                    }
                )
            })
        } else if (browserName === 'firefox') {
            const redirectUrl = browser.identity.getRedirectURL()
            const returnedUrl = await browser.identity.launchWebAuthFlow({
                interactive: true,
                url: `https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID_FIREFOX}&state=${process.env.REACT_APP_STATE_SECRET}&redirect_uri=${redirectUrl}`,
            })
            const params = new URLSearchParams(returnedUrl.split('?')[1])
            return {
                code: params.get('code'),
                state: params.get('state'),
            }
        } else if (browserName === 'edge') {
            const redirectUrl = browser.identity.getRedirectURL()
            const returnedUrl = await browser.identity.launchWebAuthFlow({
                interactive: true,
                url: `https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID_EDGE}&state=${process.env.REACT_APP_STATE_SECRET}&redirect_uri=${redirectUrl}`,
            })
            const params = new URLSearchParams(returnedUrl.split('?')[1])
            return {
                code: params.get('code'),
                state: params.get('state'),
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
