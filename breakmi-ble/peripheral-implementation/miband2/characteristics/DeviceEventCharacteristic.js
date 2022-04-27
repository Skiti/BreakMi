var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var DeviceEventCharacteristic = function() {
  DeviceEventCharacteristic.super_.call(this, {
    uuid: '00000010-0000-3512-2118-0009af100700',
    properties: ['notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(DeviceEventCharacteristic, BlenoCharacteristic);

DeviceEventCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('DeviceEventCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

DeviceEventCharacteristic.prototype.onUnsubscribe = function() {
  console.log('DeviceEventCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = DeviceEventCharacteristic;
