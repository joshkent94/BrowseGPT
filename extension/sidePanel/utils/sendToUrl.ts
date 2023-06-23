export const sendToUrl = (event: MouseEvent, url: string) => {
    event.preventDefault()
    chrome.runtime.sendMessage({
        message: {
            text: 'browse-gpt-redirect',
            url,
        },
    })
}
