import browser from 'webextension-polyfill'

export const getBrowser = () => {
    const manifest = browser.runtime.getManifest()
    const isChrome = manifest.short_name === 'BrowseGPT - Chrome'
    const isFirefox = manifest.short_name === 'BrowseGPT - Firefox'
    const isEdge = manifest.short_name === 'BrowseGPT - Edge'

    if (isChrome) return 'chrome'
    if (isFirefox) return 'firefox'
    if (isEdge) return 'edge'

    return null
}
