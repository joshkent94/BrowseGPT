export const loadPendoScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.async = false
        script.src = './pendo.js'
        document.body.appendChild(script)
        script.addEventListener('load', resolve, {
            once: true,
        })
    })
}

export const cleanUpPendoScript = () => {
    const pendoScript = document.querySelector('script[src="./pendo.js"]')
    if (pendoScript) {
        pendoScript.remove()
    }
}
