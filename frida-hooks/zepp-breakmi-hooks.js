function barrToHex(barr) {
  return Array.from(barr, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

// Web API Hooks

function WebHooks() {
  
  Java.perform(function () {

    var HMDeviceWebAPI = Java.use("com.xiaomi.hm.health.device.webapi.device.HMDeviceWebAPI");
    var HMWebBindInfo = Java.use("com.xiaomi.hm.health.device.webapi.device.HMWebBindInfo");
    var HMDeviceWebAPIb = Java.use("com.xiaomi.hm.health.device.webapi.device.HMDeviceWebAPI$b");
    var JSONObject = Java.use("org.json.JSONObject");

    HMDeviceWebAPI.bindDevice.implementation = function(bindinfo, httpresphandler, b) {

      console.warn("Inside HMDeviceWebAPI.bindDevice()");
      var retval = this.bindDevice(bindinfo, httpresphandler, b);

      var castedBindInfo = Java.cast(bindinfo, HMWebBindInfo);
      console.log("HMWebBindInfo.getMacAddress: " + castedBindInfo.getMacAddress());
      console.log("HMWebBindInfo.getFwVersion: " + castedBindInfo.getFwVersion());
      console.log("HMWebBindInfo.getAuthKey: " + castedBindInfo.getAuthKey());

      return retval;

    };

    HMDeviceWebAPI.getSign.implementation = function(barr1, barr2, i) {

      console.warn("Inside HMDeviceWebAPI.getSign()");
      var retval = this.getSign(barr1, barr2, i);

      console.log("B64Key (AuthKey+OtherBytes) : " + barrToHex(barr1));
      console.log("SHA1PublicKey: " + barrToHex(barr2));
      console.log("ServerSignature: " + barrToHex(retval));

      return retval;

    };

    HMDeviceWebAPIb.onSuccess.implementation = function(webresponse, httprespdata) {

      console.warn("Inside HMDeviceWebAPI$b.onSuccess()");
      var retval = this.onSuccess(webresponse, httprespdata);

      var signature = JSONObject.getString("signature");
      console.log("Signature: " + signature);

      return retval;

    };

    HMWebBindInfo.getAuthKey.implementation = function() {
      console.warn("Inside HMWebBindInfo.getAuthKey()");
      var retval = this.getAuthKey();
      console.log("AuthKey: " + retval);
      return retval;
    };

    HMWebBindInfo.getFwVersion.implementation = function() {
      console.warn("Inside HMWebBindInfo.getFwVersion()");
      var retval = this.getFwVersion();
      console.log("FwVersion: " + retval);
      return retval;
    };

    HMWebBindInfo.getHardwareVersion.implementation = function() {
      console.warn("Inside HMWebBindInfo.getHardwareVersion()");
      var retval = this.getHardwareVersion();
      console.log("getHardwareVersion: " + retval);
      return retval;
    };

    HMWebBindInfo.getMacAddress.implementation = function() {
      console.warn("Inside HMWebBindInfo.getMacAddress()");
      var retval = this.getMacAddress();
      console.log("MacAddress: " + retval);
      return retval;
    };

  });

}

// BLE Hooks

function BLEHooks() {
  
  Java.perform(function () {

    var HMBaseProfile = Java.use("com.xiaomi.hm.health.bt.profile.base.HMBaseProfile");
    var BluetoothGattCharacteristic = Java.use("android.bluetooth.BluetoothGattCharacteristic");

    HMBaseProfile.encrypt.implementation = function(barr1, barr2) {

      console.warn("Inside HMBaseProfile.encrypt()");
      var retval = this.encrypt(barr1, barr2);

      console.log("AES SecretKey: " + barrToHex(barr2));
      console.log("AES PlainText: " + barrToHex(barr1));
      console.log("AES CipherText: " + barrToHex(retval));

      return retval;

    };

    HMBaseProfile.read.overload("android.bluetooth.BluetoothGattCharacteristic").implementation = function(blegattchar) {

      console.warn("Inside HMBaseProfile.read()");
      var retval = this.read(blegattchar);
      console.log("BLE Read: " + barrToHex(retval));
      return retval;

    };

    HMBaseProfile.sendCommandWithNoResponse.implementation = function(blegattchar, barr) {

      console.warn("Inside HMBaseProfile.sendCommandWithNoResponse()");
      var retval = this.sendCommandWithNoResponse(blegattchar, barr);
      console.log("BLE Sent Command: " + barrToHex(barr));
      return retval;

    };

    HMBaseProfile.sendCommandWithResponse.overload("android.bluetooth.BluetoothGattCharacteristic","[B").implementation = function(blegattchar, barr) {

      console.warn("Inside HMBaseProfile.sendCommandWithResponse()");
      var retval = this.sendCommandWithResponse(blegattchar, barr);
      console.log("BLE Sent Request: " + barrToHex(barr));
      return retval;

    };

  });

}

WebHooks();
BLEHooks();
