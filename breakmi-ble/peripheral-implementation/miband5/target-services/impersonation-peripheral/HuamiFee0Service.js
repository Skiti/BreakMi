var util = require('util');
var bleno = require('bleno');

var CurrentTimeCharacteristic = require('../../characteristics/CurrentTimeCharacteristic');
var UnknownOneCharacteristic = require('../../characteristics/UnknownOneCharacteristic');
var UnknownTwoCharacteristic = require('../../characteristics/UnknownTwoCharacteristic');
var ConfigurationCharacteristic = require('../../characteristics/ConfigurationCharacteristic');
var HuamiPeripheralPreferredConnectionParametersCharacteristic = require('../../characteristics/HuamiPeripheralPreferredConnectionParametersCharacteristic');
var UnknownThreeCharacteristic = require('../../characteristics/UnknownThreeCharacteristic');
var ActivityDataCharacteristic = require('../../characteristics/ActivityDataCharacteristic');
var BatteryCharacteristic = require('../../characteristics/BatteryCharacteristic');
var StepsCharacteristic = require('../../target-characteristics/impersonation-peripheral/StepsCharacteristic');
var UserSettingsCharacteristic = require('../../characteristics/UserSettingsCharacteristic');
var DeviceEventCharacteristic = require('../../characteristics/DeviceEventCharacteristic');
var ChunkedTransferCharacteristic = require('../../target-characteristics/impersonation-peripheral/ChunkedTransferCharacteristic');
var UnknownFourCharacteristic = require('../../characteristics/UnknownFourCharacteristic');
var UnknownFiveCharacteristic = require('../../characteristics/UnknownFiveCharacteristic');
var UnknownSixCharacteristic = require('../../characteristics/UnknownSixCharacteristic');
var AudioCharacteristic = require('../../characteristics/AudioCharacteristic');
var UnknownEightCharacteristic = require('../../characteristics/UnknownEightCharacteristic');
var UnknownNoneCharacteristic = require('../../characteristics/UnknownNineCharacteristic');
var AudioDataCharacteristic = require('../../characteristics/AudioDataCharacteristic');


function HuamiFee0Service() {
    bleno.PrimaryService.call(this, {
        uuid: '0000FEE0-0000-1000-8000-00805F9B34FB',
        characteristics: [
            new CurrentTimeCharacteristic(),
            new UnknownOneCharacteristic(),
			new UnknownTwoCharacteristic(),
			new ConfigurationCharacteristic(),
			new HuamiPeripheralPreferredConnectionParametersCharacteristic(),
			new UnknownThreeCharacteristic(),
			new ActivityDataCharacteristic(),
			new BatteryCharacteristic(),
			new StepsCharacteristic(),
			new UserSettingsCharacteristic(),
			new DeviceEventCharacteristic(),
			new ChunkedTransferCharacteristic(),
			new UnknownFourCharacteristic(),
			new UnknownFiveCharacteristic(),
			new UnknownSixCharacteristic(),
			new AudioCharacteristic(),
			new AudioDataCharacteristic()
        ]
    });
}

util.inherits(HuamiFee0Service, bleno.PrimaryService);

module.exports = HuamiFee0Service;
