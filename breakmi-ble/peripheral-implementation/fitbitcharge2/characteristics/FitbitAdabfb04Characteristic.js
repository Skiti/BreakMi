var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var FitbitAdabfb04Characteristic = function() {
	FitbitAdabfb04Characteristic.super_.call(this, {
		uuid: 'ADABFB04-6E7D-4601-BDA2-BFFAA68956BA',
		properties: ['read'],
		value: new Buffer.from('00','hex'),
	});
};

util.inherits(FitbitAdabfb04Characteristic, BlenoCharacteristic);

FitbitAdabfb04Characteristic.prototype.onReadRequest = function(offset, callback) {
	console.log('FitbitAdabfb04Characteristic - onReadRequest: value = ' + this._value.toString('hex'));
	callback(this.RESULT_SUCCESS, this._value);
};

module.exports = FitbitAdabfb04Characteristic;
