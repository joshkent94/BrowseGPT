chrome.runtime.sendMessage('I am loading the content script', (response) => {
    console.log(response)
    console.log('I am the content script')
})

window.onload = () => {
    console.log('Page is fully loaded')
}
