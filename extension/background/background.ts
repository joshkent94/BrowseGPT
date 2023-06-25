// @ts-expect-error - using chrome beta api
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: Error) => console.error(error))

chrome.runtime.onMessage.addListener(({ message }) => {
    if (message.text === 'browse-gpt-redirect') {
        chrome.tabs.create({ url: message.url })
    }
})
