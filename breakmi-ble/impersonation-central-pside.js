var bleno = require('./bleno');
const prompt = require('prompt');

const PeripheralConstants = require('./peripheral-implementation/peripheral-constants');

var BlenoPrimaryService = bleno.PrimaryService;

// Xiaomi Services

var ReqGenericAccessService;
var ReqDeviceInformationService;
var ReqFirmwareService;
var ReqAlertNotificationService ;
var ReqImmediateAlertService;
var ReqHeartRateService;
var ReqHuamiFee0Service;
var ReqHuamiFee1Service;
var ReqHuamiVendorSpecificService;

var GenericAccessService;
var DeviceInformationService;
var FirmwareService;
var AlertNotificationService;
var ImmediateAlertService;
var HeartRateService;
var HuamiFee0Service;
var HuamiFee1Service;
var HuamiVendorSpecificService;

// Fitbit Services

var ReqFitbitAdabfb00Service;
var ReqCommunicationService;

var FitbitAdabfb00Service;
var CommunicationService;

const sixChoiceProperties =
 [{
	description: 'Submit a number',
	name: 'choice',
	validator: /^[1-6]$/,
	warning: 'Your choice must be a number between 1 and 6'
 }];


var deviceName;
var devicePackage;

var advertisementData;
var scanData;

var targetPlatform = "undefined";

bleno.on('stateChange', function(state) {
	console.log('on -> stateChange: ' + state);

	if (state === 'poweredOn') {
		
		prompt.start();
		console.info("\nPlease select the BLE peripheral to impersonate (1-5): \n1) Amazfit Cor 2 \n2) Mi Band 2 \n3) Mi Band 3 \n4) Mi Band 4 \n5) Mi Band 5 \n6) Fitbit Charge 2 \n\n");
		prompt.get(sixChoiceProperties, function (err, result) {
			if (result.choice == "1") {
				deviceName = PeripheralConstants.NAME_AF2;
				devicePackage = PeripheralConstants.PACKAGE_PATH + PeripheralConstants.PACKAGE_AF2;
				advertisementData = new Buffer(PeripheralConstants.ADV_DATA_AF2,'hex');
				scanData = new Buffer(PeripheralConstants.SCAN_DATA_AF2,'hex');
				advertiseXiaomiTracker();
				targetPlatform = "miband";
			} else if (result.choice == "2") {
				deviceName = PeripheralConstants.NAME_MB2;
				devicePackage = PeripheralConstants.PACKAGE_PATH + PeripheralConstants.PACKAGE_MB2;
				advertisementData = new Buffer(PeripheralConstants.ADV_DATA_MB2,'hex');
				scanData = new Buffer(PeripheralConstants.SCAN_DATA_MB2,'hex');
				advertiseXiaomiTracker();
				targetPlatform = "miband";
			} else if (result.choice == "3") {
				deviceName = PeripheralConstants.NAME_MB3;
				devicePackage = PeripheralConstants.PACKAGE_PATH + PeripheralConstants.PACKAGE_MB3;
				advertisementData = new Buffer(PeripheralConstants.ADV_DATA_MB3,'hex');
				scanData = new Buffer(PeripheralConstants.SCAN_DATA_MB3,'hex');
				advertiseXiaomiTracker();
				targetPlatform = "miband";
			} else if (result.choice == "4") {
				deviceName = PeripheralConstants.NAME_MB4;
				devicePackage = PeripheralConstants.PACKAGE_PATH + PeripheralConstants.PACKAGE_MB4;
				advertisementData = new Buffer(PeripheralConstants.ADV_DATA_MB4,'hex');
				scanData = new Buffer(PeripheralConstants.SCAN_DATA_MB4,'hex');
				advertiseXiaomiTracker();
				targetPlatform = "miband";
			} else if (result.choice == "5") {
				deviceName = PeripheralConstants.NAME_MB5;
				devicePackage = PeripheralConstants.PACKAGE_PATH + PeripheralConstants.PACKAGE_MB5;
				advertisementData = new Buffer(PeripheralConstants.ADV_DATA_MB5,'hex');
				scanData = new Buffer(PeripheralConstants.SCAN_DATA_MB5,'hex');
				advertiseXiaomiTracker();
				targetPlatform = "miband";
			} else if (result.choice == "6") {
				deviceName = PeripheralConstants.NAME_FC2;
				devicePackage = PeripheralConstants.PACKAGE_PATH + PeripheralConstants.PACKAGE_FC2;
				advertisementData = new Buffer(PeripheralConstants.ADV_DATA_FC2,'hex');
				scanData = new Buffer(PeripheralConstants.SCAN_DATA_FC2,'hex');
				advertiseFitbitTracker();
				targetPlatform = "fitbit";
			}
		});
		
		function advertiseXiaomiTracker() {
			ReqGenericAccessService = require(devicePackage  + '/services/GenericAccessService');
			ReqDeviceInformationService = require(devicePackage  + '/services/DeviceInformationService');
			ReqFirmwareService = require(devicePackage  + '/target-services/impersonation-central/FirmwareService');
			ReqAlertNotificationService = require(devicePackage  + '/services/AlertNotificationService');
			ReqImmediateAlertService = require(devicePackage  + '/services/ImmediateAlertService');
			ReqHeartRateService = require(devicePackage  + '/target-services/impersonation-central/HeartRateService');
			ReqHuamiFee0Service = require(devicePackage  + '/target-services/impersonation-central/HuamiFee0Service');
			ReqHuamiFee1Service = require(devicePackage  + '/target-services/impersonation-central/HuamiFee1Service');
			ReqHuamiVendorSpecificService = require(devicePackage  + '/services/HuamiVendorSpecificService');

			GenericAccessService = new ReqGenericAccessService();
			DeviceInformationService = new ReqDeviceInformationService();
			FirmwareService = new ReqFirmwareService();
			AlertNotificationService = new ReqAlertNotificationService();
			ImmediateAlertService = new ReqImmediateAlertService();
			HeartRateService = new ReqHeartRateService();
			HuamiFee0Service = new ReqHuamiFee0Service();
			HuamiFee1Service = new ReqHuamiFee1Service();
			HuamiVendorSpecificService = new ReqHuamiVendorSpecificService();
			
			bleno.startAdvertisingWithEIRData(advertisementData, scanData);
		}
		
		function advertiseFitbitTracker() {
			ReqGenericAccessService = require(devicePackage  + '/services/GenericAccessService');
			ReqFitbitAdabfb00Service = require(devicePackage  + '/target-services/impersonation-central/FitbitAdabfb00Service');
			ReqCommunicationService = require(devicePackage  + '/target-services/impersonation-central/CommunicationService');

			GenericAccessService = new ReqGenericAccessService();
			FitbitAdabfb00Service = new ReqFitbitAdabfb00Service();
			CommunicationService = new ReqCommunicationService();
			
			bleno.startAdvertisingWithEIRData(advertisementData, scanData);
		}
		
	} else { bleno.stopAdvertising(); }
	
});

bleno.on('advertisingStart', function(error) {
	console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));

	if (!error) {
		if (targetPlatform == "miband") {
			bleno.setServices([
				//GenericAccessService,
				DeviceInformationService,
				FirmwareService,
				AlertNotificationService,
				ImmediateAlertService,
				HeartRateService,
				HuamiFee0Service,
				HuamiFee1Service,
				HuamiVendorSpecificService
			]);
		} else if (targetPlatform == "fitbit") {
			bleno.setServices([
				//GenericAccessService,
				FitbitAdabfb00Service,
				CommunicationService
			]);
		}
	}
});
