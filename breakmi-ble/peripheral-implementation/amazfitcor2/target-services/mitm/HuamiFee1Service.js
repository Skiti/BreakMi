var util = require('util');
var bleno = require('bleno');

var AuthCharacteristic = require('../../target-characteristics/mitm/AuthCharacteristic');
var JawboneCharacteristic = require('../../characteristics/JawboneCharacteristic');
var CoinCharacteristic = require('../../characteristics/CoinCharacteristic');
var DesignShiftCharacteristic = require('../../characteristics/DesignShiftCharacteristic');
var AppleOneCharacteristic = require('../../characteristics/AppleOneCharacteristic');
var AppleTwoCharacteristic = require('../../characteristics/AppleTwoCharacteristic');
var AppleThreeCharacteristic = require('../../characteristics/AppleThreeCharacteristic');
var AppleFourCharacteristic = require('../../characteristics/AppleFourCharacteristic');

function HuamiFee1Service() {
    bleno.PrimaryService.call(this, {
        uuid: '0000FEE1-0000-1000-8000-00805F9B34FB',
        characteristics: [
            new AuthCharacteristic(),
			new JawboneCharacteristic(),
			new CoinCharacteristic(),
			new DesignShiftCharacteristic(),
			new AppleOneCharacteristic(),
			new AppleTwoCharacteristic(),
			new AppleThreeCharacteristic(),
			new AppleFourCharacteristic()
	]
    });
}

util.inherits(HuamiFee1Service, bleno.PrimaryService);

module.exports = HuamiFee1Service;
