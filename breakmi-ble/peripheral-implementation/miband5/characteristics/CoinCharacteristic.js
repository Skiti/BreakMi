var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var CoinCharacteristic = function() {
  CoinCharacteristic.super_.call(this, {
    uuid: 'FEDE',
    properties: ['read'],
    value: ''
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(CoinCharacteristic, BlenoCharacteristic);

CoinCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('CoinCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = CoinCharacteristic;
