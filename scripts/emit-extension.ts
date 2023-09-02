const { exec } = require('child_process')
const waitOn = require('wait-on')
const { promises } = require('fs');
const { resolve } = require('path');
require('dotenv').config()

const { extension, mode } = process.env
const { writeFile } = promises;
const target = extension === 'firefox' ? 'firefox-desktop' : 'chromium';
const targetDir = mode === 'production' ? 'build' : 'dist';
const command = [
    'web-ext run',
    `--source-dir ./${extension}/dist`,
    `--watch-files ./${extension}/dist/**`,
    `--target ${target}`,
    `--start-url www.google.com`,
    extension === 'chrome'
        ? `--chromium-binary '${process.env.CHROME_EXECUTABLE_PATH}' --chromium-profile '${process.env.CHROME_PROFILE_PATH}'`
        : '',
    extension === 'edge'
        ? `--chromium-binary '${process.env.EDGE_EXECUTABLE_PATH}' --chromium-profile '${process.env.EDGE_PROFILE_PATH}'`
        : '',
    extension === 'firefox'
        ? `--firefox '${process.env.FIREFOX_EXECUTABLE_PATH}' --firefox-profile '${process.env.FIREFOX_PROFILE_PATH}'`
        : '',
].join(' ')

const createManifest = async () => {
	const baseManifest = require('../extension/shared/base-manifest.json');
	const browserManifest = require(`../extension/${extension}/partial-manifest.json`);
	const mergedBrowserManifest = { ...baseManifest, ...browserManifest };

	await writeFile(resolve(__dirname, `../extension/${extension}/${targetDir}/manifest.json`), JSON.stringify(mergedBrowserManifest, null, 4));
};

waitOn({
    resources: [`./${extension}/${targetDir}`],
})
    .then(() => {
        createManifest();
        if (mode === 'development') {
            console.log(
                'Extension built! Opening the browser and watching for changes...'
            )
            exec(command, (stdout, stderr) => {
                if (stdout) console.log(stdout)
                if (stderr) console.log(stderr)
            })
        }
    })
    .catch((err) => {
        console.error(err)
    })
