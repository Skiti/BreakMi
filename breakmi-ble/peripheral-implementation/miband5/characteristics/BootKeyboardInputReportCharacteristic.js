var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var BootKeyboardInputReportCharacteristic = function() {
  BootKeyboardInputReportCharacteristic.super_.call(this, {
    uuid: '2A22',
    properties: ['read','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2901',
    	value: ''
    })
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(BootKeyboardInputReportCharacteristic, BlenoCharacteristic);

BootKeyboardInputReportCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('BootKeyboardInputReportCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('BootKeyboardInputReportCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

module.exports = BootKeyboardInputReportCharacteristic;
