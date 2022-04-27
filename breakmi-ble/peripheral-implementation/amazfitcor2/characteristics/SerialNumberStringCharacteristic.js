var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var SerialNumberStringCharacteristicCharacteristic = function() {
  SerialNumberStringCharacteristicCharacteristic.super_.call(this, {
    uuid: '2A25',
    properties: ['read'],
    value: 'PK8T98060011002f'
  });

};

util.inherits(SerialNumberStringCharacteristicCharacteristic, BlenoCharacteristic);

SerialNumberStringCharacteristicCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('SerialNumberStringCharacteristicCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = SerialNumberStringCharacteristicCharacteristic;
