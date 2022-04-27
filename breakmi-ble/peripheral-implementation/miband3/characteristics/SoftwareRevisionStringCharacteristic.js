var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var SoftwareRevisionStringCharacteristicCharacteristic = function() {
  SoftwareRevisionStringCharacteristicCharacteristic.super_.call(this, {
    uuid: '2A28',
    properties: ['read'],
    value: new Buffer('56312E342E302E3332','hex')
  });

};

util.inherits(SoftwareRevisionStringCharacteristicCharacteristic, BlenoCharacteristic);

SoftwareRevisionStringCharacteristicCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('SoftwareRevisionStringCharacteristicCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = SoftwareRevisionStringCharacteristicCharacteristic;
