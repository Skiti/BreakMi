var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var HardwareRevisionStringCharacteristicCharacteristic = function() {
  HardwareRevisionStringCharacteristicCharacteristic.super_.call(this, {
    uuid: '2A27',
    properties: ['read'],
    value: new Buffer('56302E32352E31382E35','hex')
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(HardwareRevisionStringCharacteristicCharacteristic, BlenoCharacteristic);

HardwareRevisionStringCharacteristicCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('HardwareRevisionStringCharacteristicCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = HardwareRevisionStringCharacteristicCharacteristic;
