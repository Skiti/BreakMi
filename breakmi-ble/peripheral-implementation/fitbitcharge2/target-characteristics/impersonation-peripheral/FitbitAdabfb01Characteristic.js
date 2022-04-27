var util = require('util');

var bleno = require('bleno');

var global_uvc;

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
	
	var delayedmsg1 = new Buffer('c0','hex');
	setTimeout(goAfterTimeout, 800, delayedmsg1, this._updateValueCallback);
	var delayedmsg2 = new Buffer('c0','hex');
	setTimeout(goAfterTimeout, 820, delayedmsg2, this._updateValueCallback);
	var delayedmsg3 = new Buffer('c0140c0a00008a260ece82e81700','hex');
	setTimeout(goAfterTimeout, 840, delayedmsg3, this._updateValueCallback);
};

FitbitAdabfb01Characteristic.prototype.onUnsubscribe = function() {
	console.log('FitbitAdabfb01Characteristic - onUnsubscribe');
	this._updateValueCallback = null;
};

module.exports = FitbitAdabfb01Characteristic;
