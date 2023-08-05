export const getCurrentTab = async (): Promise<string> => {
    const queryOptions = { active: true, lastFocusedWindow: true }
    const [tab] = await chrome.tabs.query(queryOptions)
    return tab?.url || ''
}
