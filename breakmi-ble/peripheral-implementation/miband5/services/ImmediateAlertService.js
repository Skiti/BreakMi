var util = require('util');
var bleno = require('bleno');

var AlertLevelCharacteristic = require('../characteristics/AlertLevelCharacteristic');

function ImmediateAlertService() {
    bleno.PrimaryService.call(this, {
        uuid: '00001802-0000-1000-8000-00805F9B34FB',
        characteristics: [
            new AlertLevelCharacteristic()
        ]
    });
}

util.inherits(ImmediateAlertService, bleno.PrimaryService);

module.exports = ImmediateAlertService;
