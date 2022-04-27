var util = require('util');
var bleno = require('bleno');

var CommunicationCharacteristic = require('../../target-characteristics/impersonation-peripheral/CommunicationCharacteristic');

function CommunicationService() {
    bleno.PrimaryService.call(this, {
        uuid: '558DFA00-4FA8-4105-9F02-4EAA93E62980',
        characteristics: [
            new CommunicationCharacteristic
        ]
    });
}

util.inherits(CommunicationService, bleno.PrimaryService);

module.exports = CommunicationService;
