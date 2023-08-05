export const getFacebookAccessToken = async (code: string) => {
    const response = await fetch(
        `https://graph.facebook.com/v17.0/oauth/access_token?client_id=${process.env.REACT_APP_FACEBOOK_CLIENT_ID}&client_secret=${process.env.REACT_APP_FACEBOOK_CLIENT_SECRET}&code=${code}&redirect_uri=https://ijdehllahgkhhcoffcohgmbebcchdknb.chromiumapp.org/callback`
    )

    if (response.ok) {
        const jsonResponse = await response.json()
        return jsonResponse.access_token
    }

    return null
}
