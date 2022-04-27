var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var DeviceNameCharacteristic = function() {
  DeviceNameCharacteristic.super_.call(this, {
    uuid: '2A00',
    properties: ['read'],
    value: 'Mi Band 3'
  });

};

util.inherits(DeviceNameCharacteristic, BlenoCharacteristic);

DeviceNameCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('DeviceNameCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = DeviceNameCharacteristic;
