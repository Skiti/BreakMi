var util = require('util');

var bleno = require('bleno');

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var ConfigurationCharacteristic = function() {
  ConfigurationCharacteristic.super_.call(this, {
    uuid: '00000003-0000-3512-2118-0009af100700',
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

util.inherits(ConfigurationCharacteristic, BlenoCharacteristic);

ConfigurationCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('ConfigurationCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

  if (data.toString('hex') == '0c') {
    this._value = new Buffer('100c05','hex');
  }
  
  if (data.toString('hex') == '11') {
    this._value = new Buffer('101101080b020700000060030000000107000000','hex');
  }
  
  if (data.toString('hex') == '0d') {
    this._value = new Buffer('100d01030040000200','hex');
  }
  
  if (data.toString('hex').substr(0,3) == '020') {
    this._value = new Buffer('100201','hex');
  }
  
  if (data.toString('hex') == '08003c000800150000000000') {
    this._value = new Buffer('100801','hex');
  }
  
  if (data.toString('hex').substr(0,2) == '06') {
	console.log('06' + data.toString('hex').substr(2,4));
	var resp = '10'.concat(data.toString('hex').substr(0,6).concat('01'));
	console.log('06 response: ' + resp);
    this._value = new Buffer(resp,'hex');
  }
  
/*

  if (data.toString('hex') == '061700656e5f5553') {
    this._value = new Buffer('1006170001'','hex');
  }

  if (data.toString('hex') == '06190001') {
    this._value = new Buffer('1006190001','hex');
  }
  
  if (data.toString('hex') == '06220000') {
    this._value = new Buffer('1006220001','hex');
  }
  
  if (data.toString('hex') == '06010000') {
    this._value = new Buffer('1006010001','hex');
  }
  
  if (data.toString('hex') == '06030001') {
    this._value = new Buffer('1006030001','hex');
  }
  
  if (data.toString('hex') == '06020001') {
    this._value = new Buffer('1006020001','hex');
  }
  
  if (data.toString('hex') == '060a0000') {
    this._value = new Buffer('10060a0001','hex');
  }
  
  if (data.toString('hex') == '0610000101') {
    this._value = new Buffer('1006100001','hex');
  }
  
  if (data.toString('hex') == '0610000001') {
    this._value = new Buffer('1006100001','hex');
  }

  if (data.toString('hex') == '0605000000000000') {
    this._value = new Buffer('1006050001','hex');
  }
  
  if (data.toString('hex') == '06060000') {
    this._value = new Buffer('1006060001','hex');
  }
  
  if (data.toString('hex') == '06230000') {
    this._value = new Buffer('1006230001','hex');
  }
  
  if (data.toString('hex') == '0607000d000000') {
    this._value = new Buffer('1006070001','hex');
  }
  
*/
  
  if (data.toString('hex') == '1a00') {
    this._value = new Buffer('101a01','hex');
  }

  if (data.toString('hex').substr(0,4) == '0100') {
    this._value = new Buffer('1001010000000000000000','hex');
  }
  
  if (data.toString('hex') == '0621000000') {
    this._value = new Buffer('1006210006','hex');
  }

  if (this._updateValueCallback) {
    console.log('ConfigurationCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }

  callback(this.RESULT_SUCCESS);
};

ConfigurationCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('ConfigurationCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

ConfigurationCharacteristic.prototype.onUnsubscribe = function() {
  console.log('ConfigurationCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = ConfigurationCharacteristic;

