var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var UnknownOneCharacteristic = function() {
  UnknownOneCharacteristic.super_.call(this, {
    uuid: '00000001-0000-3512-2118-0009af100700',
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

util.inherits(UnknownOneCharacteristic, BlenoCharacteristic);

UnknownOneCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('UnknownOneCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('UnknownOneCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

UnknownOneCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('UnknownOneCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

UnknownOneCharacteristic.prototype.onUnsubscribe = function() {
  console.log('UnknownOneCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = UnknownOneCharacteristic;
