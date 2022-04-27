var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var UnknownSixCharacteristic = function() {
  UnknownSixCharacteristic.super_.call(this, {
    uuid: '00000011-0000-3512-2118-0009af100700',
    properties: ['read','writeWithoutResponse','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(UnknownSixCharacteristic, BlenoCharacteristic);

UnknownSixCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('UnknownSixCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('UnknownSixCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

UnknownSixCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('UnknownSixCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

UnknownSixCharacteristic.prototype.onUnsubscribe = function() {
  console.log('UnknownSixCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};
module.exports = UnknownSixCharacteristic;
