var util = require('util');
var bleno = require('bleno');

var HeartRateMeasurementCharacteristic = require('../../target-characteristics/mitm/HeartRateMeasurementCharacteristic');
var HeartRateControlPointCharacteristic = require('../../target-characteristics/mitm/HeartRateControlPointCharacteristic');

function HeartRateService() {
    bleno.PrimaryService.call(this, {
        uuid: '0000180D-0000-1000-8000-00805F9B34FB',
        characteristics: [
            new HeartRateMeasurementCharacteristic(),
            new HeartRateControlPointCharacteristic()
        ]
    });
}

util.inherits(HeartRateService, bleno.PrimaryService);

module.exports = HeartRateService;
