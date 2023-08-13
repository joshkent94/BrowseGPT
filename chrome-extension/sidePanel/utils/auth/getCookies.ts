export const getCookies = async (
    options: chrome.cookies.GetAllDetails
): Promise<chrome.cookies.Cookie[]> => {
    return new Promise((resolve, reject) => {
        chrome.cookies.getAll(options, (cookies) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError)
            } else {
                resolve(cookies)
            }
        })
    })
}
