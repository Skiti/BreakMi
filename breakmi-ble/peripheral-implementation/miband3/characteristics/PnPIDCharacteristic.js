var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var PnPIDCharacteristic = function() {
  PnPIDCharacteristic.super_.call(this, {
    uuid: '2A50',
    properties: ['read'],
    value: new Buffer('01570113000001','hex')
  });

};

util.inherits(PnPIDCharacteristic, BlenoCharacteristic);

PnPIDCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('PnPIDCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = PnPIDCharacteristic;
