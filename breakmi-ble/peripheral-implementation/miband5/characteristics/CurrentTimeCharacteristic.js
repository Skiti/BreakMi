var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var CurrentTimeCharacteristic = function() {
  CurrentTimeCharacteristic.super_.call(this, {
    uuid: '2A2B',
    properties: ['read','write','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });
  this._value = new Buffer('E507020A00032403000004','hex');
};

util.inherits(CurrentTimeCharacteristic, BlenoCharacteristic);

CurrentTimeCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('CurrentTimeCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

CurrentTimeCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('CurrentTimeCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('CurrentTimeCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

CurrentTimeCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('CurrentTimeCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

CurrentTimeCharacteristic.prototype.onUnsubscribe = function() {
  console.log('CurrentTimeCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = CurrentTimeCharacteristic;
