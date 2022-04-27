var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var BootKeyboardOutputReportCharacteristic = function() {
  BootKeyboardOutputReportCharacteristic.super_.call(this, {
    uuid: '2A32',
    properties: ['read','write','writeWithoutResponse'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2901',
    	value: ''
    })
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(BootKeyboardOutputReportCharacteristic, BlenoCharacteristic);

BootKeyboardOutputReportCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('BootKeyboardOutputReportCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('BootKeyboardOutputReportCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

module.exports = BootKeyboardOutputReportCharacteristic;
