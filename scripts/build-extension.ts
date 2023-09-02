const waitOn = require('wait-on');
const { execSync } = require('child_process');
require('dotenv').config();

const { extension } = process.env;

waitOn({
	resources: [`./server/dist`]
})
	.then(() => {
		console.log('Server built and booting up! Starting extension build...');
		execSync(`npm --prefix ./extension/ run dev --extension=${extension}`, { stdio: 'inherit' });
	})
	.catch((err) => {
		console.error(err);
	});
