var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var SystemIDCharacteristicCharacteristic = function() {
  SystemIDCharacteristicCharacteristic.super_.call(this, {
    uuid: '2A23',
    properties: ['read'],
    value: new Buffer('F34EC4FFFE1E460F','hex')
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(SystemIDCharacteristicCharacteristic, BlenoCharacteristic);

SystemIDCharacteristicCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('SystemIDCharacteristicCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = SystemIDCharacteristicCharacteristic;
