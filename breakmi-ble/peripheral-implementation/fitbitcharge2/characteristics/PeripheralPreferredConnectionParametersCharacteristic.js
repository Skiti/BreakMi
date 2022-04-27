var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var PeripheralPreferredConnectionParametersCharacteristic = function() {
	PeripheralPreferredConnectionParametersCharacteristic.super_.call(this, {
		uuid: '2A04',
		properties: ['read','write'],
		value: ''
	});
	this._value = 'Connection Interval: no specific minimum - no specific maximum, Slave Latency: 0, Supervision Timeout Multiplier: no specific value requested';
};

util.inherits(PeripheralPreferredConnectionParametersCharacteristic, BlenoCharacteristic);

PeripheralPreferredConnectionParametersCharacteristic.prototype.onReadRequest = function(offset, callback) {
	console.log('PeripheralPreferredConnectionParametersCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));
	
	callback(this.RESULT_SUCCESS, this._value);
};

PeripheralPreferredConnectionParametersCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	this._value = data;
	console.log('PeripheralPreferredConnectionParametersCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));
	
	if (this._updateValueCallback) {
		console.log('PeripheralPreferredConnectionParametersCharacteristic - onWriteRequest: notifying');
		this._updateValueCallback(this._value);
	}
	callback(this.RESULT_SUCCESS);
};

module.exports = PeripheralPreferredConnectionParametersCharacteristic;
