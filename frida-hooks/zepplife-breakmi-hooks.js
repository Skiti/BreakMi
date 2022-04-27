function barrToHex(barr) {
  return Array.from(barr, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

// Web API Hooks

function WebHooks() {
  
  Java.perform(function () {

    var HMDeviceWebAPI = Java.use("com.xiaomi.hm.health.webapi.device.OooO00o");
    var HMWebBindInfo = Java.use("com.xiaomi.hm.health.device.webapi.device.OooO0O0");
    var HMDeviceWebAPIb = Java.use("com.xiaomi.hm.health.device.webapi.device.OooO00o$OooO00o");
    var JSONObject = Java.use("org.json.JSONObject");

    HMDeviceWebAPI.OooO00o.implementation = function(bindinfo, httpresphandler, b) {

      console.warn("Inside HMDeviceWebAPI.bindDevice()");
      var retval = this.OooO00o(bindinfo, httpresphandler, b);

      var castedBindInfo = Java.cast(bindinfo, HMWebBindInfo);
      console.log("HMWebBindInfo.getMacAddress: " + castedBindInfo.OooO0o());
      console.log("HMWebBindInfo.getFwVersion: " + castedBindInfo.OooOOO0());
      console.log("HMWebBindInfo.getAuthKey: " + castedBindInfo.OooOOo());

      return retval;

    };

    HMDeviceWebAPI.OooO0Oo.implementation = function(barr1, barr2, i) {

      console.warn("Inside HMDeviceWebAPI.getSign()");
      var retval = this.OooO0Oo(barr1, barr2, i);

      console.log("B64Key (AuthKey+OtherBytes) : " + barrToHex(barr1));
      console.log("SHA1PublicKey: " + barrToHex(barr2));
      console.log("ServerSignature: " + barrToHex(retval));

      return retval;

    };

    HMDeviceWebAPIb.OooO00o.implementation = function(webresponse, httprespdata) {

      console.warn("Inside HMDeviceWebAPI$b.onSuccess()");
      var retval = this.OooO00o(webresponse, httprespdata);

      var signature = JSONObject.getString("signature");
      console.log("Signature: " + signature);

      return retval;

    };

    HMWebBindInfo.OooOOo.implementation = function() {
      console.warn("Inside HMWebBindInfo.getAuthKey()");
      var retval = this.OooOOo();
      console.log("AuthKey: " + retval);
      return retval;
    };

    HMWebBindInfo.OooOOO0.implementation = function() {
      console.warn("Inside HMWebBindInfo.getFwVersion()");
      var retval = this.OooOOO0();
      console.log("FwVersion: " + retval);
      return retval;
    };

    HMWebBindInfo.OooOOOO.implementation = function() {
      console.warn("Inside HMWebBindInfo.getHardwareVersion()");
      var retval = this.OooOOOO();
      console.log("getHardwareVersion: " + retval);
      return retval;
    };

    HMWebBindInfo.OooO0o.implementation = function() {
      console.warn("Inside HMWebBindInfo.getMacAddress()");
      var retval = this.OooO0o();
      console.log("MacAddress: " + retval);
      return retval;
    };

  });

}

// BLE Hooks

function BLEHooks() {
  
  Java.perform(function () {

    var HMBaseProfile = Java.use("com.xiaomi.hm.health.bt.profile.base.Oooo000");
    var BluetoothGattCharacteristic = Java.use("android.bluetooth.BluetoothGattCharacteristic");

    HMBaseProfile.Oooo00O.implementation = function(barr1, barr2) {

      console.warn("Inside HMBaseProfile.encrypt()");
      var retval = this.Oooo00O(barr1, barr2);

      console.log("AES SecretKey: " + barrToHex(barr2));
      console.log("AES PlainText: " + barrToHex(barr1));
      console.log("AES CipherText: " + barrToHex(retval));

      return retval;

    };

    HMBaseProfile.Oooo.overload("android.bluetooth.BluetoothGattCharacteristic").implementation = function(blegattchar) {

      console.warn("Inside HMBaseProfile.read()");
      var retval = this.Oooo(blegattchar);
      console.log("BLE Read: " + barrToHex(retval));
      return retval;

    };

    HMBaseProfile.OoooO0O.implementation = function(blegattchar, barr) {

      console.warn("Inside HMBaseProfile.sendCommandWithNoResponse()");
      var retval = this.OoooO0O(blegattchar, barr);
      console.log("BLE Sent Command: " + barrToHex(barr));
      return retval;

    };

    HMBaseProfile.OoooOO0.overload("android.bluetooth.BluetoothGattCharacteristic","[B").implementation = function(blegattchar, barr) {

      console.warn("Inside HMBaseProfile.sendCommandWithResponse()");
      var retval = this.OoooOO0(blegattchar, barr);
      console.log("BLE Sent Request: " + barrToHex(barr));
      return retval;

    };

  });

}

WebHooks();
BLEHooks();
