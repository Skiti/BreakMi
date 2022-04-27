var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var FirmwareDataCharacteristic = function() {
  FirmwareDataCharacteristic.super_.call(this, {
    uuid: '00001532-0000-3512-2118-0009af100700',
    properties: ['writeWithoutResponse'],
    value: ''
  });
};

util.inherits(FirmwareDataCharacteristic, BlenoCharacteristic);

FirmwareDataCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('FirmwareDataCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('FirmwareDataCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

module.exports = FirmwareDataCharacteristic;
