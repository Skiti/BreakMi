var util = require('util');
var bleno = require('bleno');

var NewAlertCharacteristic = require('../characteristics/NewAlertCharacteristic');
var AlertNotificationControlPointCharacteristic = require('../characteristics/AlertNotificationControlPointCharacteristic');

function AlertNotificationService() {
    bleno.PrimaryService.call(this, {
        uuid: '00001811-0000-1000-8000-00805F9B34FB',
        characteristics: [
            new NewAlertCharacteristic(),
            new AlertNotificationControlPointCharacteristic()
        ]
    });
}

util.inherits(AlertNotificationService, bleno.PrimaryService);

module.exports = AlertNotificationService;
