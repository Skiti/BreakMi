var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var HeartRateMeasurementCharacteristic = function() {
  HeartRateMeasurementCharacteristic.super_.call(this, {
    uuid: '2A37',
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

util.inherits(HeartRateMeasurementCharacteristic, BlenoCharacteristic);

HeartRateMeasurementCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('HeartRateMeasurementCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

HeartRateMeasurementCharacteristic.prototype.onUnsubscribe = function() {
  console.log('HeartRateMeasurementCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = HeartRateMeasurementCharacteristic;
