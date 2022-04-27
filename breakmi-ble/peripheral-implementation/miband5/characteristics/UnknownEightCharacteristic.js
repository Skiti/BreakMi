var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var UnknownEightCharacteristic = function() {
  UnknownEightCharacteristic.super_.call(this, {
    uuid: '00000016-0000-3512-2118-0009af100700',
    properties: ['writeWithoutResponse','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(UnknownEightCharacteristic, BlenoCharacteristic);

UnknownEightCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('UnknownEightCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('UnknownEightCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

UnknownEightCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('UnknownEightCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

UnknownEightCharacteristic.prototype.onUnsubscribe = function() {
  console.log('UnknownEightCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};
module.exports = UnknownEightCharacteristic;
