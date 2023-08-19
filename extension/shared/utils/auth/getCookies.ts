import browser from 'webextension-polyfill'

declare type opts = {
    name?: string
}

export const getCookies = async (
    options: opts
): Promise<browser.Cookies.Cookie[]> => {
    const cookies = await browser.cookies.getAll(options)
    return cookies
}
