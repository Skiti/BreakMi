var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var AppleThreeCharacteristic = function() {
  AppleThreeCharacteristic.super_.call(this, {
    uuid: 'FED2',
    properties: ['read'],
    value: ''
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(AppleThreeCharacteristic, BlenoCharacteristic);

AppleThreeCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('AppleThreeCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = AppleThreeCharacteristic;
