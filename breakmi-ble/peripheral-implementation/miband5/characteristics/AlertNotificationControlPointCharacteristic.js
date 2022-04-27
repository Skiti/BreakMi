var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var AlertNotificationControlPointCharacteristic = function() {
  AlertNotificationControlPointCharacteristic.super_.call(this, {
    uuid: '2A44',
    properties: ['read','write','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });
  this._value = new Buffer('00','hex');
};

util.inherits(AlertNotificationControlPointCharacteristic, BlenoCharacteristic);

AlertNotificationControlPointCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('AlertNotificationControlPointCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

AlertNotificationControlPointCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('AlertNotificationControlPointCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('AlertNotificationControlPointCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

AlertNotificationControlPointCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('AlertNotificationControlPointCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

AlertNotificationControlPointCharacteristic.prototype.onUnsubscribe = function() {
  console.log('AlertNotificationControlPointCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = AlertNotificationControlPointCharacteristic;
