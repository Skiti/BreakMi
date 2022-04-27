var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var PnPIDCharacteristic = function() {
  PnPIDCharacteristic.super_.call(this, {
    uuid: '2A50',
    properties: ['read'],
    value: new Buffer('01570124000101','hex')
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(PnPIDCharacteristic, BlenoCharacteristic);

PnPIDCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('PnPIDCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = PnPIDCharacteristic;
