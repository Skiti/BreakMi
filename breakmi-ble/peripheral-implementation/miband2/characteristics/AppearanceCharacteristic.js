var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var AppearanceCharacteristic = function() {
  AppearanceCharacteristic.super_.call(this, {
    uuid: '2A01',
    properties: ['read'],
    value: '[0] Unknown'
  });

};

util.inherits(AppearanceCharacteristic, BlenoCharacteristic);

AppearanceCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('AppearanceCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = AppearanceCharacteristic;
