var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var HardwareRevisionStringCharacteristicCharacteristic = function() {
  HardwareRevisionStringCharacteristicCharacteristic.super_.call(this, {
    uuid: '2A27',
    properties: ['read'],
    value: 'V0.21.19.39'
  });

};

util.inherits(HardwareRevisionStringCharacteristicCharacteristic, BlenoCharacteristic);

HardwareRevisionStringCharacteristicCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('HardwareRevisionStringCharacteristicCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = HardwareRevisionStringCharacteristicCharacteristic;
