chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    sendResponse('From the background script')
})
