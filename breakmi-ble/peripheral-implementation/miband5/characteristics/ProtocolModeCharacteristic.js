var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var ProtocolModeCharacteristic = function() {
  ProtocolModeCharacteristic.super_.call(this, {
    uuid: '2A4E',
    properties: ['read','writeWithoutResponse'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2901',
    	value: ''
    })
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(ProtocolModeCharacteristic, BlenoCharacteristic);

ProtocolModeCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('ProtocolModeCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('ProtocolModeCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

module.exports = ProtocolModeCharacteristic;
