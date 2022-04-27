var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var Characteristic = function() {
  Characteristic.super_.call(this, {
    uuid: '',
    properties: ['read'],
    value: ''
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(Characteristic, BlenoCharacteristic);

Characteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('Characteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = Characteristic;
