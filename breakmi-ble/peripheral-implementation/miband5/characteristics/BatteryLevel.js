var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var BatteryLevelCharacteristic = function() {
  BatteryLevelCharacteristic.super_.call(this, {
    uuid: '2A19',
    properties: ['read','notify'],
    value: new Buffer('33','hex'),
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });

};

util.inherits(BatteryLevelCharacteristic, BlenoCharacteristic);

BatteryLevelCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('BatteryLevelCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

BatteryLevelCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('BatteryLevelCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

BatteryLevelCharacteristic.prototype.onUnsubscribe = function() {
  console.log('BatteryLevelCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = BatteryLevelCharacteristic;
