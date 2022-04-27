var util = require('util');
var bleno = require('bleno');

var DeviceNameCharacteristic = require('../characteristics/DeviceNameCharacteristic');
var AppearanceCharacteristic = require('../characteristics/AppearanceCharacteristic');
var PeripheralPreferredConnectionParametersCharacteristic = require('../characteristics/PeripheralPreferredConnectionParametersCharacteristic');

function GenericAccessService() {
    bleno.PrimaryService.call(this, {
        uuid: '00001800-0000-1000-8000-00805F9B34FB',
        characteristics: [
            new DeviceNameCharacteristic(),
            new AppearanceCharacteristic(),
            new PeripheralPreferredConnectionParametersCharacteristic()
        ]
    });
}

util.inherits(GenericAccessService, bleno.PrimaryService);

module.exports = GenericAccessService;
