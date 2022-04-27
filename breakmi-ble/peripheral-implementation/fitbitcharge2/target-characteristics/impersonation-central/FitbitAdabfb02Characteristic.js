var util = require('util');

var bleno = require('bleno');

const io = require("socket.io-client");
const socket1 = io("ws://localhost:3001");

var BlenoCharacteristic = bleno.Characteristic;

var FitbitAdabfb02Characteristic = function() {
	FitbitAdabfb02Characteristic.super_.call(this, {
		uuid: 'ADABFB02-6E7D-4601-BDA2-BFFAA68956BA',
		properties: ['read','writeWithoutResponse'],
		value: '',
	});
	this._value = new Buffer.from('0000000000000000000000000000000000000000','hex');
	this._updateValueCallback = null;
};

util.inherits(FitbitAdabfb02Characteristic, BlenoCharacteristic);

FitbitAdabfb02Characteristic.prototype.onReadRequest = function(offset, callback) {
	console.log('FitbitAdabfb02Characteristic - onReadRequest: value = ' + this._value.toString('hex'));
	callback(this.RESULT_SUCCESS, this._value);
};

FitbitAdabfb02Characteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	this._value = data;
	console.log('FitbitAdabfb02Characteristic - onWriteRequest: value = ' + this._value.toString('hex'));
	/*
	if (data.toString('hex') == 'c00a0a00180028000000c80001') {
		socket1.emit("initialize-session");
	} else if (data.toString('hex').substr(0,4) == 'c050') {
		var nonce = data.toString('hex').substr(4,20);
		socket1.emit("initialize-auth", nonce);
	} else if (data.toString('hex').substr(0,4) == 'c052') {
		var solution = data.toString('hex').substr(4,20);
		socket1.emit("challenge-solution", solution);
	} else if (data.toString('hex').substr(0,4) == 'c001') {
		socket1.emit("repeat-c001");
	}*/
	
	console.log("Websocket 3001 sent Legitimate Fitbit command to another characteristic");
	socket1.emit("fitbit-command", data.toString('hex'));
	
	callback(this.RESULT_SUCCESS);
};

module.exports = FitbitAdabfb02Characteristic;
