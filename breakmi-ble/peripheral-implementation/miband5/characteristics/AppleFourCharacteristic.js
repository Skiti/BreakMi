var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var AppleFourCharacteristic = function() {
  AppleFourCharacteristic.super_.call(this, {
    uuid: 'FED3',
    properties: ['read','write'],
    value: ''
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(AppleFourCharacteristic, BlenoCharacteristic);

AppleFourCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('AppleFourCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

AppleFourCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('AppleFourCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('AppleFourCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

module.exports = AppleFourCharacteristic;
