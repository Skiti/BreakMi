var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var FitbitAdabfb03Characteristic = function() {
	FitbitAdabfb03Characteristic.super_.call(this, {
		uuid: 'ADABFB03-6E7D-4601-BDA2-BFFAA68956BA',
		properties: ['read','notify'],
		value: '',
		descriptor: new Descriptor({
			uuid: '2902',
			value: 'Notifications and indications disabled',
		})
	});
	
	this._value = new Buffer.from('0100','hex');
};

util.inherits(FitbitAdabfb03Characteristic, BlenoCharacteristic);

FitbitAdabfb03Characteristic.prototype.onReadRequest = function(offset, callback) {
	console.log('FitbitAdabfb03Characteristic - onReadRequest: value = ' + this._value.toString('hex'));
	callback(this.RESULT_SUCCESS, this._value);
};

FitbitAdabfb03Characteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
	console.log('FitbitAdabfb03Characteristic - onSubscribe');
	this._updateValueCallback = updateValueCallback;
};

FitbitAdabfb03Characteristic.prototype.onUnsubscribe = function() {
	console.log('FitbitAdabfb03Characteristic - onUnsubscribe');
	this._updateValueCallback = null;
};

module.exports = FitbitAdabfb03Characteristic;
