var util = require('util');

var bleno = require('bleno');

// a random challenge value that can be customized
var challenge = "1234567890abcdef1234567890abcdef";

var BlenoCharacteristic = bleno.Characteristic;
var Descriptor = bleno.Descriptor;

var AuthCharacteristic = function() {
	AuthCharacteristic.super_.call(this, {
		uuid: '00000009-0000-3512-2118-0009af100700',
		properties: ['read','writeWithoutResponse','notify'],
		value: '',
		descriptor: new Descriptor({
			uuid: '2901',
			value: ''
		})
	});
	
	this._value = new Buffer(0);
  	this._updateValueCallback = null;

};

util.inherits(AuthCharacteristic, BlenoCharacteristic);

AuthCharacteristic.prototype.onReadRequest = function(offset, callback) {
	console.log('AuthCharacteristic - onReadRequest: value = ' + this._value.toString('hex'));
	callback(this.RESULT_SUCCESS, this._value);
};


AuthCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	
	this._value = data;
	console.log('AuthCharacteristic - onWriteRequest: value = ' + this._value.toString('hex'));

	if (data.toString('hex').substr(0,4) == '0100') {
		if (data.toString('hex').length == 4) {
			console.log('Sending protocol version packet');
			this._value = new Buffer('100104','hex');
		}
		else {
			console.log('Sending authkey accepted');
			this._value = new Buffer('100101','hex');
		}
	}
	
	if (data.toString('hex') == '020002') {
		console.log('Sending challenge after request: ' + challenge);
		this._value = new Buffer('100201' + challenge,'hex');
	}

	if (data.toString('hex').substr(0,4) == '0300') {
		console.log('Sending solution accepted'); 
		var solution = data.toString('hex').substr(4,36);
		this._value = new Buffer('100301','hex');
	}
	
	if (this._updateValueCallback) {
		this._updateValueCallback(this._value);
		console.log('AuthCharacteristic - onWriteRequest: notifying');
	}
	
	callback(this.RESULT_SUCCESS);

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
