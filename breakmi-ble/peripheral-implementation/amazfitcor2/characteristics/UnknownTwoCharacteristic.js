var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var UnknownTwoCharacteristic = function() {
  UnknownTwoCharacteristic.super_.call(this, {
    uuid: '00000002-0000-3512-2118-0009af100700',
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

util.inherits(UnknownTwoCharacteristic, BlenoCharacteristic);

UnknownTwoCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('UnknownTwoCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

UnknownTwoCharacteristic.prototype.onUnsubscribe = function() {
  console.log('UnknownTwoCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = UnknownTwoCharacteristic;
