export const sendToUrl = (event: MouseEvent, url: string) => {
    event.preventDefault()
    chrome.tabs.create({ url })
}
