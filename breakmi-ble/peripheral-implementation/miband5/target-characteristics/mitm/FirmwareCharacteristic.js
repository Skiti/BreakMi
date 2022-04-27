var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var FirmwareCharacteristic = function() {
  FirmwareCharacteristic.super_.call(this, {
    uuid: '00001531-0000-3512-2118-0009af100700',
    properties: ['write','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });
};

util.inherits(FirmwareCharacteristic, BlenoCharacteristic);

FirmwareCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('FirmwareCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (data.toString('hex') == 'a0') {
    this._value = new Buffer('10a0010600040080000002','hex');
  }

  if (data.toString('hex') == '01ff') {
    this._value = new Buffer('100109','hex');
  }

  if (data.toString('hex').substr(0,4) == '0100') {
    this._value = new Buffer('1001010000000000000000','hex');
  }

  if (this._updateValueCallback) {
    console.log('FirmwareCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

FirmwareCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('FirmwareCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

FirmwareCharacteristic.prototype.onUnsubscribe = function() {
  console.log('FirmwareCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = FirmwareCharacteristic;
