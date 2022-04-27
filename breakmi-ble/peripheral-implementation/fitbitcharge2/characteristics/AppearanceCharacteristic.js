var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var AppearanceCharacteristic = function() {
	AppearanceCharacteristic.super_.call(this, {
		uuid: '2A01',
		properties: ['read','write','writeWithoutResponse'],
		value: '',
	});
	this._value = new Buffer.from('4004','hex');
	// 1088 1
};
	
util.inherits(AppearanceCharacteristic, BlenoCharacteristic);

AppearanceCharacteristic.prototype.onReadRequest = function(offset, callback) {
	console.log('AppearanceCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));
	callback(this.RESULT_SUCCESS, this._value);
};

module.exports = AppearanceCharacteristic;
