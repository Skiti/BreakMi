var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var ActivityDataCharacteristic = function() {
  ActivityDataCharacteristic.super_.call(this, {
    uuid: '00000005-0000-3512-2118-0009af100700',
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

util.inherits(ActivityDataCharacteristic, BlenoCharacteristic);

ActivityDataCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('ActivityDataCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

ActivityDataCharacteristic.prototype.onUnsubscribe = function() {
  console.log('ActivityDataCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = ActivityDataCharacteristic;
