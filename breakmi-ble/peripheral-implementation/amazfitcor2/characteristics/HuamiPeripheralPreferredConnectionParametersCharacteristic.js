var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var HuamiPeripheralPreferredConnectionParametersCharacteristic = function() {
  HuamiPeripheralPreferredConnectionParametersCharacteristic.super_.call(this, {
    uuid: '2A04',
    properties: ['read','writeWithoutResponse','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });

  this._value = new Buffer('270027000000F401','hex');
  this._updateValueCallback = null;
};

util.inherits(HuamiPeripheralPreferredConnectionParametersCharacteristic, BlenoCharacteristic);

HuamiPeripheralPreferredConnectionParametersCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('HuamiPeripheralPreferredConnectionParametersCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

HuamiPeripheralPreferredConnectionParametersCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('HuamiPeripheralPreferredConnectionParametersCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    //console.log('HuamiPeripheralPreferredConnectionParametersCharacteristic - onWriteRequest: notifying');

    //this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

HuamiPeripheralPreferredConnectionParametersCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('HuamiPeripheralPreferredConnectionParametersCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

HuamiPeripheralPreferredConnectionParametersCharacteristic.prototype.onUnsubscribe = function() {
  console.log('HuamiPeripheralPreferredConnectionParametersCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = HuamiPeripheralPreferredConnectionParametersCharacteristic;
