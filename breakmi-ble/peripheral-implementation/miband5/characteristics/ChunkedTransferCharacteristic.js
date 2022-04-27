var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var ChunkedTransferCharacteristic = function() {
  ChunkedTransferCharacteristic.super_.call(this, {
    uuid: '00000020-0000-3512-2118-0009af100700',
    properties: ['read','writeWithoutResponse','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2902',
    	value: new Buffer('0000')
    })
  });
  this._value = new Buffer('0B','hex');
};

util.inherits(ChunkedTransferCharacteristic, BlenoCharacteristic);

ChunkedTransferCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('ChunkedTransferCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

function goAfterTimeout(v, uvc, c, rs) {
  if (uvc) {
      console.log('ChunkedTransferCharacteristic222 - onWriteRequest: notifying');
      uvc(v);
    }
    c(rs);
};

ChunkedTransferCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('ChunkedTransferCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (data.toString('hex') == '0084040000') {
    this._value = new Buffer('10008401010000','hex');
    setTimeout(goAfterTimeout, 1500, this._value, this._updateValueCallback, callback, this.RESULT_SUCCESS);
  }

  if (data.toString('hex').substr(0,6) == '008201') {
    this._value = new Buffer('10008201010000','hex');
    if (this._updateValueCallback) {
      console.log('ChunkedTransferCharacteristic - onWriteRequest: notifying');

      this._updateValueCallback(this._value);
    }

    callback(this.RESULT_SUCCESS);
  }

  if (data.toString('hex').substr(0,6) == '00c100') { // Begin Weather condition
    this._value = new Buffer('1000c101010000','hex');
    if (this._updateValueCallback) {
      console.log('ChunkedTransferCharacteristic - onWriteRequest: notifying');

      this._updateValueCallback(this._value);
    }

    callback(this.RESULT_SUCCESS);
  }

  //if (data.toString('hex') == '000100014e8a645f04050000190e436c65617200') { // Clear, no notification response
  // 00:41:01:00:01:17:0e:43:6c:65:61:72:00:01:01:18:0f:43:6c:6f Thunderstorm, no notification response

  if (data.toString('hex').substr(0,6) == '008105') { // End Weather Condition
    this._value = new Buffer('10008101010000','hex');
    if (this._updateValueCallback) {
      console.log('ChunkedTransferCharacteristic - onWriteRequest: notifying');

      this._updateValueCallback(this._value);
    }

    callback(this.RESULT_SUCCESS);
  }

  if (data.toString('hex').substr(0,6) == '00c300') {
    this._value = new Buffer('1000c301010000','hex');
    if (this._updateValueCallback) {
      console.log('ChunkedTransferCharacteristic - onWriteRequest: notifying');

      this._updateValueCallback(this._value);
    }

    callback(this.RESULT_SUCCESS);
  }

};

ChunkedTransferCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('ChunkedTransferCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

ChunkedTransferCharacteristic.prototype.onUnsubscribe = function() {
  console.log('ChunkedTransferCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = ChunkedTransferCharacteristic;
