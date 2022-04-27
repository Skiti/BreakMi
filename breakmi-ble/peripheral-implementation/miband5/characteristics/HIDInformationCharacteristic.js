var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var HIDInformationCharacteristic = function() {
  HIDInformationCharacteristic.super_.call(this, {
    uuid: '2A4A',
    properties: ['read'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2901',
    	value: ''
    })
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(HIDInformationCharacteristic, BlenoCharacteristic);

HIDInformationCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('HIDInformationCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('HIDInformationCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

module.exports = HIDInformationCharacteristic;
