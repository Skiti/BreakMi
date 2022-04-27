const prompt = require('prompt');
const figlet = require('figlet');
const childprocess = require('child_process');

const threeChoiceProperties =
    [{
		description: 'Submit a number',
		name: 'choice',
		validator: /^[1-3]$/,
		warning: 'Your choice must be a number between 1 and 3'
    }];
    
const twoChoiceProperties =
    [{
		description: 'Submit a number',
		name: 'choice',
		validator: /^[1-2]$/,
		warning: 'Your choice must be a number between 1 and 2'
    }];

function onErr(err) {
    console.log(err);
    return 1;
}

figlet.text('breakmi', {
    font: 'Doom',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
}, function(err, data) {
    if (err) {
		console.log('BreakMi has been broken..');
		console.dir(err);
		return;
    }
    console.log(data);
});

setTimeout(run, 500);

function run() {
	prompt.start();
	console.info("\nPlease select an OTA attack (1-3): \n1) Peripheral Impersonation \n2) Central Impersonation \n3) Man-in-the-Middle \n\n");
	prompt.get(threeChoiceProperties, function (err, result) {
		if (err) { return onErr(err); }
		if (result.choice == "1") {
			runScript('./impersonation-peripheral.js', function (err) {
				if (err) throw err;
				console.log('Peripheral Impersonation terminated');
			});
		} else if (result.choice == "2") {
			runImpersonationCentral();
		} else if (result.choice == "3") {
			runMitm();
		} else { console.log('BreakMi has been broken..'); process.exit(); }
	});
}

function runImpersonationCentral() {
	prompt.start();
	console.info("\nPlease select the target (1-2): \n1) Central Impersonation (central-side) \n2) Central Impersonation (peripheral-side) \n\n");
	prompt.get(twoChoiceProperties, function (err, result) {
		if (err) { return onErr(err); }
		if (result.choice == "1") {
			runScript('./impersonation-central-cside.js', function (err) {
				if (err) throw err;
				console.log('Central Impersonation (central-side) terminated');
			});
		} else if (result.choice == "2") {
			runScript('./impersonation-central-pside.js', function (err) {
				if (err) throw err;
				console.log('Central Impersonation (peripheral-side) terminated');
			});
		} else { console.log('BreakMi has been broken..'); process.exit(); }
	});
}

function runMitm() {
	prompt.start();
	console.info("\nPlease select the target (1-2): \n1) Man-in-the-Middle (central-side) \n2) Man-in-the-Middle (peripheral-side) \n\n");
	prompt.get(twoChoiceProperties, function (err, result) {
		if (err) { return onErr(err); }
		if (result.choice == "1") {
			runScript('./mitm-cside.js', function (err) {
				if (err) throw err;
				console.log('Man-in-the-Middle (central-side) terminated');
			});
		} else if (result.choice == "2") {
			runScript('./mitm-pside.js', function (err) {
				if (err) throw err;
				console.log('Man-in-the-Middle (peripheral-side) terminated');
			});
		} else { console.log('BreakMi has been broken..'); process.exit(0); }
	});
}


function runScript(scriptPath, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childprocess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}
