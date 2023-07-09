// @ts-expect-error - using chrome beta api
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: Error) => {
        throw new Error(error.message)
    })
