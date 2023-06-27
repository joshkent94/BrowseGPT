// @ts-expect-error - using chrome beta api
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: Error) => {
        throw new Error(error.message)
    })

chrome.runtime.onMessage.addListener(({ message }) => {
    if (message.text === 'browse-gpt-redirect') {
        chrome.tabs.create({ url: message.url })
    }
})
