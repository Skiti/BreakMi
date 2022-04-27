var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var AlertlevelCharacteristic = function() {
  AlertlevelCharacteristic.super_.call(this, {
    uuid: '2A06',
    properties: ['writeWithoutResponse'],
    value: ''
  });
};

util.inherits(AlertlevelCharacteristic, BlenoCharacteristic);

AlertlevelCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('AlertlevelCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('AlertlevelCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

module.exports = AlertlevelCharacteristic;
