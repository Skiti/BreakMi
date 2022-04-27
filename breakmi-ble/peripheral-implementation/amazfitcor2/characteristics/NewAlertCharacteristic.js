var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var NewAlertCharacteristic = function() {
  NewAlertCharacteristic.super_.call(this, {
    uuid: '2A46',
    properties: ['write'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2901',
    	value: ''
    })
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(NewAlertCharacteristic, BlenoCharacteristic);

NewAlertCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('NewAlertCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('NewAlertCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

module.exports = NewAlertCharacteristic;
