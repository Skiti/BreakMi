var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var SoftwareRevisionStringCharacteristicCharacteristic = function() {
  SoftwareRevisionStringCharacteristicCharacteristic.super_.call(this, {
    uuid: '2A28',
    properties: ['read'],
    value: 'V0.3.0.66'
  });

};

util.inherits(SoftwareRevisionStringCharacteristicCharacteristic, BlenoCharacteristic);

SoftwareRevisionStringCharacteristicCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('SoftwareRevisionStringCharacteristicCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = SoftwareRevisionStringCharacteristicCharacteristic;
