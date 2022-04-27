var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var AuthCharacteristic = function() {
  AuthCharacteristic.super_.call(this, {
    uuid: '00000009-0000-3512-2118-0009af100700',
    properties: ['read','writeWithoutResponse','notify'],
    value: '',
    descriptor: new Descriptor({
    	uuid: '2901',
    	value: new Buffer('Anhui Huami Information Technology Co.')
    })
  });
  this._value = new Buffer('00000000','hex');
  this._counter = 0;
  this._challenge = false;
};

util.inherits(AuthCharacteristic, BlenoCharacteristic);

AuthCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('AuthCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));

  callback(this.RESULT_SUCCESS, this._value);
};

function goAfterTimeout(v, uvc, c, rs) {
  if (uvc) {
      console.log('AuthCharacteristic delayed - onWriteRequest: notifying');
      uvc(v);
    }
    c(rs);
};

AuthCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('AuthCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (data.toString('hex') == '0100') {
    this._value = new Buffer('100181011863c2cce5d159413bed92c4b163c279','hex');
    if (this._updateValueCallback) {
      console.log('AuthCharacteristic - onWriteRequest: notifying');
      this._updateValueCallback(this._value);
    }
    callback(this.RESULT_SUCCESS);
  }

  if (data.toString('hex') == '820002') {
    if (!this._challenge) {
      console.log('820002 pairing');
      //this._value = new Buffer('108201d204cbb786dae0dd7b56bfc7b596cc08','hex');
      //this._value = new Buffer('1082018ee60c18acfea3e88da2f2a2b8ed9208','hex');
      this._value = new Buffer('108201ed46021b561cef7b011e559a2c16e55a','hex');
      this._challenge = true;
      var delayedmsg1 = new Buffer('108301','hex');
      setTimeout(goAfterTimeout, 350, delayedmsg1, this._updateValueCallback, callback, this.RESULT_SUCCESS);
      var delayedmsg2 = new Buffer('100101','hex');
      setTimeout(goAfterTimeout, 2000, delayedmsg2, this._updateValueCallback, callback, this.RESULT_SUCCESS);
    }
    else {
      console.log('820002 challenge');  
      this._value = new Buffer('1082013be06a657fdb6ee9114c855e52f0aebd','hex');
    }
    if (this._updateValueCallback) {
      console.log('AuthCharacteristic - onWriteRequest: notifying');
      this._updateValueCallback(this._value);
    }
    callback(this.RESULT_SUCCESS);
  }

  //if (data.toString('hex') == '8300a1376f36fd2bd603024f1629c9bbbe1f') { //hardcoded, to implement
  if (data.toString('hex').substr(0,4) == '8300') {
     console.log('8300 solution'); 
     this._value = new Buffer('108301','hex');
     if (this._updateValueCallback) {
       console.log('AuthCharacteristic - onWriteRequest: notifying');
       this._updateValueCallback(this._value);
     }
     callback(this.RESULT_SUCCESS);
  }

};


AuthCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('AuthCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;

};

AuthCharacteristic.prototype.onUnsubscribe = function() {
  console.log('AuthCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};


module.exports = AuthCharacteristic;
