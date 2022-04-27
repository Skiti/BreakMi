var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var PeripheralPreferredConnectionParametersCharacteristic = function() {
  PeripheralPreferredConnectionParametersCharacteristic.super_.call(this, {
    uuid: '2A04',
    properties: ['read'],
    value: 'Connection Interval: 7.50ms - 1000.00ms, Slave Latency: 0, Supervision Timeout Multiplier: 500'
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(PeripheralPreferredConnectionParametersCharacteristic, BlenoCharacteristic);

PeripheralPreferredConnectionParametersCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('PeripheralPreferredConnectionParametersCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = PeripheralPreferredConnectionParametersCharacteristic;
