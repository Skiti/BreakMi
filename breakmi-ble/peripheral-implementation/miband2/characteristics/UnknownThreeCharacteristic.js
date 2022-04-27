var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var UnknownThreeCharacteristic = function() {
  UnknownThreeCharacteristic.super_.call(this, {
    uuid: '00000004-0000-3512-2118-0009af100700',
    properties: ['writeWithoutResponse','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(UnknownThreeCharacteristic, BlenoCharacteristic);

UnknownThreeCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('UnknownThreeCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (data.toString('hex').substr(0,3) == '010') {
    var resp = '10010100000000'.concat(data.toString('hex').substr(4,13)).concat('3').concat(data.toString('hex').substr(15,18)).concat('08');
    this._value = new Buffer(resp,'hex');
  }

  if (data.toString('hex') == '03') {
    this._value = new Buffer('100301','hex');
  }

  if (this._updateValueCallback) {
    console.log('UnknownThreeCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

UnknownThreeCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('UnknownThreeCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

UnknownThreeCharacteristic.prototype.onUnsubscribe = function() {
  console.log('UnknownThreeCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = UnknownThreeCharacteristic;
