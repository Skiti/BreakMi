var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var DeviceNameCharacteristic = function() {
	DeviceNameCharacteristic.super_.call(this, {
		uuid: '2A00',
		properties: ['read','write','writeWithoutResponse'],
		value: ''
	});
	this._value = new Buffer.from('4368617267652032','hex');
};

util.inherits(DeviceNameCharacteristic, BlenoCharacteristic);

DeviceNameCharacteristic.prototype.onReadRequest = function(offset, callback) {
	console.log('DeviceNameCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));
	callback(this.RESULT_SUCCESS, this._value);
};

DeviceNameCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	this._value = data;
	console.log('DeviceNameCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));
	
	if (this._updateValueCallback) {
		console.log('DeviceNameCharacteristic - onWriteRequest: notifying');
		this._updateValueCallback(this._value);
	}
	callback(this.RESULT_SUCCESS);
};

module.exports = DeviceNameCharacteristic;
