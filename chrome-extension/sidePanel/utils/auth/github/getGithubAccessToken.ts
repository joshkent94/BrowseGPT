export const getGithubAccessToken = async (code: string) => {
    const response = await fetch(
        `https://github.com/login/oauth/access_token?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}&code=${code}`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
        }
    )

    if (response.ok) {
        const jsonResponse = await response.json()
        return jsonResponse.access_token
    }

    return null
}
