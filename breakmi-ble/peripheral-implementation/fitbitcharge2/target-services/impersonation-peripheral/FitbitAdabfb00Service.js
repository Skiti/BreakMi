var util = require('util');
var bleno = require('bleno');

var FitbitAdabfb04Characteristic = require('../../characteristics/FitbitAdabfb04Characteristic');
var FitbitAdabfb02Characteristic = require('../../target-characteristics/impersonation-peripheral/FitbitAdabfb02Characteristic');
var FitbitAdabfb03Characteristic = require('../../target-characteristics/impersonation-peripheral/FitbitAdabfb03Characteristic');
var FitbitAdabfb01Characteristic = require('../../target-characteristics/impersonation-peripheral/FitbitAdabfb01Characteristic');

function FitbitAdabfb00Service() {
    bleno.PrimaryService.call(this, {
        uuid: 'ADABFB00-6E7D-4601-BDA2-BFFAA68956BA',
        characteristics: [
            new FitbitAdabfb04Characteristic(),
			new FitbitAdabfb02Characteristic(),
			new FitbitAdabfb03Characteristic(),
			new FitbitAdabfb01Characteristic()
        ]
    });
}

util.inherits(FitbitAdabfb00Service, bleno.PrimaryService);

module.exports = FitbitAdabfb00Service;
