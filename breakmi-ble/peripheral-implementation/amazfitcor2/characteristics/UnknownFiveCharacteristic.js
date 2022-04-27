var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var UnknownFiveCharacteristic = function() {
  UnknownFiveCharacteristic.super_.call(this, {
    uuid: '0000000f-0000-3512-2118-0009af100700',
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

util.inherits(UnknownFiveCharacteristic, BlenoCharacteristic);

UnknownFiveCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('UnknownFiveCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('UnknownFiveCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

UnknownFiveCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('UnknownFiveCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

UnknownFiveCharacteristic.prototype.onUnsubscribe = function() {
  console.log('UnknownFiveCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = UnknownFiveCharacteristic;
