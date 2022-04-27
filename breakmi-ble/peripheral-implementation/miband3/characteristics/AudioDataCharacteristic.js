var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var AudioDataCharacteristic = function() {
  AudioDataCharacteristic.super_.call(this, {
    uuid: '00000013-0000-3512-2118-0009af100700',
    properties: ['read','write','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(AudioDataCharacteristic, BlenoCharacteristic);

AudioDataCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('AudioDataCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

AudioDataCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('AudioDataCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('AudioDataCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

AudioDataCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('AudioDataCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

AudioDataCharacteristic.prototype.onUnsubscribe = function() {
  console.log('AudioDataCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = AudioDataCharacteristic;
