const { exec } = require('child_process')
const waitOn = require('wait-on')
require('dotenv').config()

const { extension } = process.env
const target = extension === 'chrome' ? 'chromium' : 'firefox-desktop'
const command = [
    'web-ext run',
    `--source-dir ./${extension}/dist`,
    `--watch-files ./${extension}/dist/**`,
    `--target ${target}`,
    `--start-url www.google.com`,
    target === 'chromium'
        ? `--chromium-binary '${process.env.CHROME_EXECUTABLE_PATH}' --chromium-profile '${process.env.CHROME_PROFILE_PATH}'`
        : '',
    target === 'firefox-desktop'
        ? `--firefox '${process.env.FIREFOX_EXECUTABLE_PATH}' --firefox-profile '${process.env.FIREFOX_PROFILE_PATH}'`
        : '',
].join(' ')

waitOn({
    resources: [`./${extension}/dist`],
})
    .then(() => {
        console.log(
            'Extension built, running in the browser and watching for changes...'
        )
        exec(command, (stdout, stderr) => {
            if (stdout) console.log(stdout)
            if (stderr) console.log(stderr)
        })
    })
    .catch((err) => {
        console.error(err)
    })
