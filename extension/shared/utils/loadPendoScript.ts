import browser from 'webextension-polyfill'

/* eslint prefer-rest-params: 0 */
export const loadPendoScript = () => {
    return new Promise((resolve) => {
        const urlRedirects = {
            'https://app.pendo.io/in-app-designer/latest/plugin.js':
                browser.runtime.getURL('./plugin.js'),
            'https://app.pendo.io/in-app-designer/latest/preloader.js':
                browser.runtime.getURL('./preloader.js'),
            'https://cdn.pendo.io/agent/releases/2.193.0/pendo.preview.min.js':
                browser.runtime.getURL('./pendo.preview.min.js'),
            'https://pendo-static-6159375992225792.storage.googleapis.com/global-guide.js/2jmj7l5rSw0yVb_vlWAYkK_YBwk':
                browser.runtime.getURL('./global-guide.js'),
            'https://cdn.pendo.io/agent/releases/2.193.0/pendo.debugger.min.js':
                browser.runtime.getURL('./pendo.debugger.min.js'),
            'https://pendo-io-static.storage.googleapis.com/agent/static/30efa22f-a150-4de1-7714-8536b9b061f8/pendo-unminified.js':
                browser.runtime.getURL('./pendo-unminified.js'),
        }

        const overwriteAppendChild = (appendChild: any) => {
            // @ts-expect-error - TS doesn't like overwriting native methods
            Element.prototype.appendChild = newAppend

            function newAppend() {
                if (arguments[0]?.tagName === 'IFRAME') {
                    const pendoCallback = arguments[0].onload
                    arguments[0].onload = function () {
                        if (this.contentDocument) {
                            this.contentDocument.body.appendChild = newAppend
                            pendoCallback()
                        }
                    }
                }

                if (urlRedirects[arguments[0].src]) {
                    arguments[0].src = urlRedirects[arguments[0].src]
                }

                appendChild.apply(this, arguments)
            }
        }
        overwriteAppendChild(Element.prototype.appendChild)

        const overwriteInsertBefore = (insertBefore: any) => {
            // @ts-expect-error - TS doesn't like overwriting native methods
            Node.prototype.insertBefore = function () {
                if (urlRedirects[arguments[0].src]) {
                    arguments[0].src = urlRedirects[arguments[0].src]
                }

                insertBefore.apply(this, arguments)
            }
        }
        overwriteInsertBefore(Node.prototype.insertBefore)

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
