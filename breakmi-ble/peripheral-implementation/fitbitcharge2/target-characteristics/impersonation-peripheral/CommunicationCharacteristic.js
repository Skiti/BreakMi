var util = require('util');

var bleno = require('../../../../bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var constantUpdate = false;

var CommunicationCharacteristic = function() {
	CommunicationCharacteristic.super_.call(this, {
		uuid: '558DFA01-4FA8-4105-9F02-4EAA93E62980',
		properties: ['read','notify'],
		value: '',
		descriptor: new Descriptor({
			uuid: '2902',
			value: 'Notifications and indications disabled',
		})
	});
	
	this._value = new Buffer.from('0000000000000000000000000000000000000000','hex');
};

util.inherits(CommunicationCharacteristic, BlenoCharacteristic);

function goAfterTimeout(v, uvc, c, rs) {
	if (uvc) {
		console.log('CommunicationCharacteristic delayed - onWriteRequest: value = ' + v.toString('hex'));
		uvc(v);
    }
};

CommunicationCharacteristic.prototype.onReadRequest = function(offset, callback) {
	console.log('CommunicationCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));
	callback(this.RESULT_SUCCESS, this._value);
};

CommunicationCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
	console.log('CommunicationCharacteristic - onSubscribe');
	this._updateValueCallback = updateValueCallback;
	constantUpdate = true;
	statusUpdate(0);
};

function statusUpdate(steps) {
	console.log("statusUpdate");
	if(constantUpdate) {
		steps = steps + 1;
		var hexSteps = steps.toString(16);
		var buf1 = Buffer.from('8b136660','hex');
		var buf2 = Buffer.from(hexSteps,'hex');
		var buf3 = Buffer.from('00000002580000c505000000000000','hex');
		var arr = [buf1,buf2,buf3];
		var delayedmsg = new Buffer.concat(arr);
		setTimeout(goAfterTimeout, 100, delayedmsg, this._updateValueCallback);
	}
}

CommunicationCharacteristic.prototype.onUnsubscribe = function() {
	console.log('CommunicationCharacteristic - onUnsubscribe');
	constantUpdate = false;
	this._updateValueCallback = null;
};

module.exports = CommunicationCharacteristic;
