import browser from 'webextension-polyfill'

export const getCurrentTab = async (): Promise<string> => {
    const queryOptions = { active: true, lastFocusedWindow: true }
    const [tab] = await browser.tabs.query(queryOptions)
    return tab?.url || ''
}
