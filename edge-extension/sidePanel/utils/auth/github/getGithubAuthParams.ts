declare interface GithubAuthURLParams {
    code: string | null
    state: string | null
}

export const getGithubAuthParams = async (): Promise<GithubAuthURLParams> => {
    return new Promise((resolve, reject) => {
        chrome.identity.launchWebAuthFlow(
            {
                interactive: true,
                url: `https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&state=${process.env.REACT_APP_STATE_SECRET}`,
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
}
