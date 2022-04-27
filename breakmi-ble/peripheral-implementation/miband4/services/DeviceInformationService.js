var util = require('util');
var bleno = require('bleno');

var SerialNumberStringCharacteristic = require('../characteristics/SerialNumberStringCharacteristic');
var HardwareRevisionStringCharacteristic = require('../characteristics/HardwareRevisionStringCharacteristic');
var SoftwareRevisionStringCharacteristic = require('../characteristics/SoftwareRevisionStringCharacteristic');
var SystemIDCharacteristic = require('../characteristics/SystemIDCharacteristic');
var PnPIDCharacteristic = require('../characteristics/PnPIDCharacteristic');

function DeviceInformationService() {
    bleno.PrimaryService.call(this, {
        uuid: '0000180A-0000-1000-8000-00805F9B34FB',
        characteristics: [
            new SerialNumberStringCharacteristic(),
            new HardwareRevisionStringCharacteristic(),
			new SoftwareRevisionStringCharacteristic(),
			new SystemIDCharacteristic(),
            new PnPIDCharacteristic()
        ]
    });
}

util.inherits(DeviceInformationService, bleno.PrimaryService);

module.exports = DeviceInformationService;
