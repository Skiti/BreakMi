var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var UserSettingsCharacteristic = function() {
  UserSettingsCharacteristic.super_.call(this, {
    uuid: '00000008-0000-3512-2118-0009af100700',
    properties: ['write','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(UserSettingsCharacteristic, BlenoCharacteristic);

UserSettingsCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('UserSettingsCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('UserSettingsCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

UserSettingsCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('UserSettingsCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

UserSettingsCharacteristic.prototype.onUnsubscribe = function() {
  console.log('UserSettingsCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = UserSettingsCharacteristic;
