var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var AudioCharacteristic = function() {
  AudioCharacteristic.super_.call(this, {
    uuid: '00000012-0000-3512-2118-0009af100700',
    properties: ['read','writeWithoutResponse','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });

  this._value = new Buffer('0D','hex');
  this._updateValueCallback = null;
};

util.inherits(AudioCharacteristic, BlenoCharacteristic);

AudioCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('AudioCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

AudioCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('AudioCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('AudioCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

AudioCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('AudioCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

AudioCharacteristic.prototype.onUnsubscribe = function() {
  console.log('AudioCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = AudioCharacteristic;
