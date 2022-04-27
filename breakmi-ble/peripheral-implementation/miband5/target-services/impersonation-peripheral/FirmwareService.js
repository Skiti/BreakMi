var util = require('util');
var bleno = require('bleno');

var FirmwareCharacteristic = require('../../target-characteristics/impersonation-peripheral/FirmwareCharacteristic');
var FirmwareDataCharacteristic = require('../../target-characteristics/impersonation-peripheral/FirmwareDataCharacteristic');

function FirmwareService() {
    bleno.PrimaryService.call(this, {
        uuid: '00001530-0000-3512-2118-0009af100700',
        characteristics: [
            new FirmwareCharacteristic(),
            new FirmwareDataCharacteristic()
        ]
    });
}

util.inherits(FirmwareService, bleno.PrimaryService);

module.exports = FirmwareService;
