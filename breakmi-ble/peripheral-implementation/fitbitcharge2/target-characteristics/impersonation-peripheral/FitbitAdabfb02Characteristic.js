var util = require('util');

var bleno = require('bleno');

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
	callback(this.RESULT_SUCCESS);
};

module.exports = FitbitAdabfb02Characteristic;
