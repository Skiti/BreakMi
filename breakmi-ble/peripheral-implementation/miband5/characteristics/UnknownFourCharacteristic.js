var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var UnknownFourCharacteristic = function() {
  UnknownFourCharacteristic.super_.call(this, {
    uuid: '0000000e-0000-3512-2118-0009af100700',
    properties: ['write'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2901',
    	value: ''
    })
  });
};

util.inherits(UnknownFourCharacteristic, BlenoCharacteristic);

UnknownFourCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('UnknownFourCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('UnknownFourCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

module.exports = UnknownFourCharacteristic;
