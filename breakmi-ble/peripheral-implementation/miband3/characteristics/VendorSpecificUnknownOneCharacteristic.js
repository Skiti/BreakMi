var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var VendorSpecificUnknownOneCharacteristic = function() {
  VendorSpecificUnknownOneCharacteristic.super_.call(this, {
    uuid: '4A02',
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

util.inherits(VendorSpecificUnknownOneCharacteristic, BlenoCharacteristic);

VendorSpecificUnknownOneCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('VendorSpecificUnknownOneCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

VendorSpecificUnknownOneCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('VendorSpecificUnknownOneCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('VendorSpecificUnknownOneCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

VendorSpecificUnknownOneCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('VendorSpecificUnknownOneCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

VendorSpecificUnknownOneCharacteristic.prototype.onUnsubscribe = function() {
  console.log('VendorSpecificUnknownOneCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = VendorSpecificUnknownOneCharacteristic;
