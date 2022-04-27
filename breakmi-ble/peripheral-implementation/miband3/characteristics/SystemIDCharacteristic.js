var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var SystemIDCharacteristicCharacteristic = function() {
  SystemIDCharacteristicCharacteristic.super_.call(this, {
    uuid: '2A23',
    properties: ['read'],
    value: new Buffer('646C80FFFE33F82E','hex')
  });

};

util.inherits(SystemIDCharacteristicCharacteristic, BlenoCharacteristic);

SystemIDCharacteristicCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('SystemIDCharacteristicCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = SystemIDCharacteristicCharacteristic;
