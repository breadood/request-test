const needle = require('needle');
const log = require('not-fancy-log');
const chalk = require('chalk');
const tape = require('tape');

const defaultOptions = {
	statusCode: [200],
	host: 'www.google.com',
	path: '',
	protocol: 'http',
	queryParam: ''
};
defaultOptions.statusCode = [200];

let testName = "";

tape.createStream({ objectMode: true })
.on('data', function (data) {
	if (data.type === "test") {
		testName = data.name;
	}

	if (data.type === "assert") {
		let status = data.ok ? chalk.hex('#00FF00')("passed") : chalk.red("failed");
		log(testName, '-' ,status);
	}
});

function requestTest(options) {
	options = Object.assign({}, defaultOptions, options);

	return function (testName, path) {
		tape(testName, function (t) {
			t.plan(1);
			path = path || options.path;
			let newURL = options.protocol + '://' + options.host + path;
			
			needle('get', newURL)
			.then(function (resp) {
				t.ok(options.statusCode.includes(resp.statusCode), 'Status Code is a Redirect Code');
			})
			.catch(function (err) {
				log(err);
				t.fail('Request Failing');
			})
		})
	}
}

module.exports = requestTest;