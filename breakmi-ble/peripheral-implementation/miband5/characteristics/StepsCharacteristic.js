var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var StepsCharacteristic = function() {
  StepsCharacteristic.super_.call(this, {
    uuid: '00000007-0000-3512-2118-0009af100700',
    properties: ['read','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });
  this._value = new Buffer('0005500000','hex');
};

util.inherits(StepsCharacteristic, BlenoCharacteristic);

StepsCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('StepsCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

StepsCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('StepsCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

StepsCharacteristic.prototype.onUnsubscribe = function() {
  console.log('StepsCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = StepsCharacteristic;
