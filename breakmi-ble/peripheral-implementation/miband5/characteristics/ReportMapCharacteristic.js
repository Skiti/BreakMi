var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var ReportMapCharacteristic = function() {
  ReportMapCharacteristic.super_.call(this, {
    uuid: '2A4B',
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

util.inherits(ReportMapCharacteristic, BlenoCharacteristic);

ReportMapCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('ReportMapCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('ReportMapCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

module.exports = ReportMapCharacteristic;
