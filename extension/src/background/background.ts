// @ts-expect-error - using chrome beta api
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error))

chrome.runtime.onMessage.addListener(({ message }) => {
    if (message.text === 'api-key-redirect') {
        chrome.tabs.create({ url: message.url })
    }
})
