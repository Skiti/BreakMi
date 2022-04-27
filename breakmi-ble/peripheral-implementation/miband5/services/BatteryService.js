var util = require('util');
var bleno = require('bleno');

var BatteryLevelCharacteristic = require('../characteristics/BatteryLevelCharacteristic');

function BatteryService() {
    bleno.PrimaryService.call(this, {
        uuid: '00001530-0000-3512-2118-0009af100700',
        characteristics: [
            new BatteryLevelCharacteristic()
        ]
    });
}

util.inherits(BatteryService, bleno.PrimaryService);

module.exports = BatteryService;
