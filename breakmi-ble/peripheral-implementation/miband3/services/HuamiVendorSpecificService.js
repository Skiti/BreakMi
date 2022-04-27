var util = require('util');
var bleno = require('bleno');

var VendorSpecificUnknownOneCharacteristic = require('../characteristics/VendorSpecificUnknownOneCharacteristic');

function HuamiVendorSpecificService() {
    bleno.PrimaryService.call(this, {
        uuid: '00003802-0000-1000-8000-00805F9B34FB',
        characteristics: [
            new VendorSpecificUnknownOneCharacteristic(),
        ]
    });
}

util.inherits(HuamiVendorSpecificService, bleno.PrimaryService);

module.exports = HuamiVendorSpecificService;
