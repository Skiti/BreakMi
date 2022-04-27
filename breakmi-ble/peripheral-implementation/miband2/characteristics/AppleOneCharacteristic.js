var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var AppleOneCharacteristic = function() {
  AppleOneCharacteristic.super_.call(this, {
    uuid: 'FED0',
    properties: ['read','write'],
    value: ''
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(AppleOneCharacteristic, BlenoCharacteristic);

AppleOneCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('AppleOneCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

AppleOneCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('AppleOneCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('AppleOneCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

module.exports = AppleOneCharacteristic;
