declare interface FacebookAuthURLParams {
    code: string | null
    state: string | null
}

export const getFacebookAuthParams =
    async (): Promise<FacebookAuthURLParams> => {
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
    }
