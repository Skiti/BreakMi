var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var HeartRateControlPointCharacteristic = function() {
  HeartRateControlPointCharacteristic.super_.call(this, {
    uuid: '2A39',
    properties: ['read','write'],
    value: ''
  });
};

util.inherits(HeartRateControlPointCharacteristic, BlenoCharacteristic);

HeartRateControlPointCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('HeartRateControlPointCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

HeartRateControlPointCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('HeartRateControlPointCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('HeartRateControlPointCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

module.exports = HeartRateControlPointCharacteristic;
