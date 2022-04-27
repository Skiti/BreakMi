var util = require('util');

var bleno = require('bleno');

const io = require("socket.io-client");
const socket = io("ws://localhost:3000");

var falseHeartrate = 123;

socket.on("connection", socket => {
	console.log("Websocket connected");
});

socket.on("heartrate-value", (heartrate) => {
	console.log("\n---\nWebsocket received heartrate value: " + heartrate + '\n---\n');
	falseHeartrate = heartrate;
});

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var HeartRateMeasurementCharacteristic = function() {
	HeartRateMeasurementCharacteristic.super_.call(this, {
		uuid: '2A37',
		properties: ['notify'],
		value: '',
		descriptor: new Descriptor({
			uuid: '2902',
			value: new Buffer('0000')
		})
	});
};

util.inherits(HeartRateMeasurementCharacteristic, BlenoCharacteristic);

HeartRateMeasurementCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
	console.log('HeartRateMeasurementCharacteristic - onSubscribe');
	console.log("\n---\nWebsocket sent heartrate-request\n---\n");
	socket.emit("heartrate-request");
	
	this.changeInterval = setInterval(function() {
		console.log('HeartRateMeasurementCharacteristic update value: ' + falseHeartrate);
		var finalHexHeartrate = '';
		var hexHeartrate = falseHeartrate.toString(16);
		for (var i=hexHeartrate.length; i<4; i++) {
			finalHexHeartrate = finalHexHeartrate + "0";
		}
		finalHexHeartrate = finalHexHeartrate + hexHeartrate.substring(0,hexHeartrate.length);
		var hrBuf = Buffer.from(finalHexHeartrate,'hex');
		updateValueCallback(hrBuf);
	}.bind(this), 2000);
};

HeartRateMeasurementCharacteristic.prototype.onUnsubscribe = function() {
	console.log('HeartRateMeasurementCharacteristic - onUnsubscribe');
	this._updateValueCallback = null;
};

HeartRateMeasurementCharacteristic.prototype.onNotify = function() {
	console.log('HeartRateMeasurementCharacteristic - onNotify');
};

module.exports = HeartRateMeasurementCharacteristic;
