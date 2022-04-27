var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var UnknownNineCharacteristic = function() {
  UnknownNineCharacteristic.super_.call(this, {
    uuid: '00000017-0000-3512-2118-0009af100700',
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

util.inherits(UnknownNineCharacteristic, BlenoCharacteristic);

UnknownNineCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('UnknownNineCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('UnknownNineCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

UnknownNineCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('UnknownNineCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

UnknownNineCharacteristic.prototype.onUnsubscribe = function() {
  console.log('UnknownNineCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};
module.exports = UnknownNineCharacteristic;
