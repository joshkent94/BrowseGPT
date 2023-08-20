import browser from 'webextension-polyfill'

export const sendToUrl = (event: MouseEvent, url: string) => {
    event.preventDefault()
    browser.tabs.create({ url })
}
