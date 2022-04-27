var util = require('util');
var bleno = require('bleno');

var ProtocolModeCharacteristic = require('../characteristics/ProtocolModeCharacteristic');
var ReportMapCharacteristic = require('../characteristics/ReportMapCharacteristic');
var HIDInformationCharacteristic = require('../characteristics/HIDInformationCharacteristic');
var HIDControlPointCharacteristic = require('../characteristics/HIDControlPointCharacteristic');
var ReportCharacteristic = require('../characteristics/ReportCharacteristic');
var BootKeyboardInputReportCharacteristic = require('../characteristics/BootKeyboardInputReportCharacteristic');
var BootKeyboardOutputReportCharacteristic = require('../characteristics/BootKeyboardOutputReportCharacteristic');


function HumanInterfaceDeviceService() {
    bleno.PrimaryService.call(this, {
        uuid: '00001812-0000-1000-8000-00805F9B34FB',
        characteristics: [
            new ProtocolModeCharacteristic(),
	    new ReportMapCharacteristic(),
            new HIDInformationCharacteristic(),
            new HIDControlPointCharacteristic(),
            new ReportCharacteristic(),
            new BootKeyboardInputReportCharacteristic(),
            new BootKeyboardOutputReportCharacteristic()
        ]
    });
}

util.inherits(HumanInterfaceDeviceService, bleno.PrimaryService);

module.exports = HumanInterfaceDeviceService;
