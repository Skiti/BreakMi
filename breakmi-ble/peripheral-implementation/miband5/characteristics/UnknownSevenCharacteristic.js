var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var UnknownSevenCharacteristic = function() {
  UnknownSevenCharacteristic.super_.call(this, {
    uuid: '00000014-0000-3512-2118-0009af100700',
    properties: ['writeWithoutResponse','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });
};

util.inherits(UnknownSevenCharacteristic, BlenoCharacteristic);

UnknownSevenCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('UnknownSevenCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (data.toString('hex') == 'fd0f000000') {
     this._value = new Buffer('8001c0000f00000001010a03abb802020800','hex');
  }

  if (this._updateValueCallback) {
    console.log('UnknownSevenCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

UnknownSevenCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('UnknownSevenCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

UnknownSevenCharacteristic.prototype.onUnsubscribe = function() {
  console.log('UnknownSevenCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};
module.exports = UnknownSevenCharacteristic;
