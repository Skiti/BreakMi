var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var JawboneCharacteristic = function() {
  JawboneCharacteristic.super_.call(this, {
    uuid: 'FEDD',
    properties: ['write'],
    value: ''
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(JawboneCharacteristic, BlenoCharacteristic);

JawboneCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('JawboneCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (this._updateValueCallback) {
    console.log('JawboneCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

module.exports = JawboneCharacteristic;
