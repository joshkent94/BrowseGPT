export const sendToUrl = (event: any, url: string) => {
    event.preventDefault()
    chrome.runtime.sendMessage({
        message: {
            text: 'browse-gpt-redirect',
            url,
        },
    })
}
