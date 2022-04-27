var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;

var DesignShiftCharacteristic = function() {
  DesignShiftCharacteristic.super_.call(this, {
    uuid: 'FEDF',
    properties: ['read'],
    value: new Buffer('01','hex')
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(DesignShiftCharacteristic, BlenoCharacteristic);

DesignShiftCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('DesignShiftCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

module.exports = DesignShiftCharacteristic;
