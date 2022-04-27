var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var BatteryCharacteristic = function() {
  BatteryCharacteristic.super_.call(this, {
    uuid: '00000006-0000-3512-2118-0009af100700',
    properties: ['read','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });
  this._value = new Buffer('0F3300B207010100000000B20701010000000000','hex');
};

util.inherits(BatteryCharacteristic, BlenoCharacteristic);

BatteryCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('BatteryCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

BatteryCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('BatteryCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

BatteryCharacteristic.prototype.onUnsubscribe = function() {
  console.log('BatteryCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = BatteryCharacteristic;
