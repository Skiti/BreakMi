var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var KDDICorporationCharacteristic = function() {
  KDDICorporationCharacteristic.super_.call(this, {
    uuid: '0000fec1-0000-3512-2118-0009af100700',
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

util.inherits(KDDICorporationCharacteristic, BlenoCharacteristic);

KDDICorporationCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('KDDICorporationCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

KDDICorporationCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('KDDICorporationCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('KDDICorporationCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

KDDICorporationCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('KDDICorporationCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

KDDICorporationCharacteristic.prototype.onUnsubscribe = function() {
  console.log('KDDICorporationCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};
module.exports = KDDICorporationCharacteristic;
