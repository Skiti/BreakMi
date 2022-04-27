package breakmi;

import android.app.Activity;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCharacteristic;
import android.graphics.Color;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

public class ProtocolManager {

    private static final String TAG = "ProtocolManager";
    private static byte[] authKey;
    private static boolean isSetAuthKey = false;
    private static boolean waitingForAuth = false;

    // magic value received from server-side pairing to send through chunked transfer, for now we only have demo values which are invalid
    private static final byte[] MB_SSP_CHUNK1 = new byte[] { 0x22, (byte) 0xb0, 0x0f, (byte) 0xdd, 0x5e, 0x45, (byte) 0xe0, (byte) 0xd3, (byte) 0xb4, 0x6f, 0x6f, 0x0b, 0x0e, (byte) 0x9a, 0x5d };
    private static final byte[] MB_SSP_CHUNK2 = new byte[] { (byte) 0xa5, (byte) 0xed, (byte) 0xf3, (byte) 0xeb, (byte) 0xaa, 0x5c, (byte) 0x89,(byte)  0xe8, (byte) 0xc7, 0x78, 0x26, 0x2e, (byte) 0x85, 0x2f, (byte) 0x98, (byte) 0x98, 0x68 };
    private static final byte[] MB_SSP_CHUNK3 = new byte[] { 0x7e, 0x76, 0x52, (byte) 0xf7, (byte) 0xeb, (byte) 0xa8, 0x00, (byte) 0xaa, (byte) 0xc1, 0x19, 0x73, 0x30, (byte) 0xa9, (byte) 0xe3, 0x1c, 0x08, 0x25 };
    private static final byte[] MB_SSP_CHUNK4 = new byte[] { (byte) 0xcd, (byte) 0xb5, 0x71, (byte) 0xe7, (byte) 0xde, 0x1e, 0x0e, (byte) 0xc8, (byte) 0xad, 0x31, (byte) 0x92, (byte) 0x9e, 0x58, (byte) 0xdd, 0x60 };

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    protected static void mbp1Manager(BluetoothGattCharacteristic characteristic, byte[] value, BluetoothGatt bluetoothGatt, Activity activity) throws NoSuchAlgorithmException, BadPaddingException, NoSuchPaddingException, IllegalBlockSizeException, InvalidKeyException, InterruptedException {

        String valrec = "";
        for (int i = 0; i < value.length; i++) {
            valrec = valrec + value[i] + " ";
        }

        if (value[0] == (byte) 0x10
                && value[1] == (byte) 0x01
                && value[2] == (byte) 0x04) {
            Log.d(TAG,"(PAIRING) pair_v1");
            byte[] arbitraryAuthkey = new byte[]{0x7f, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x7f};
            setAuthKey(arbitraryAuthkey);
            byte[] pairingRequest = GenericUtils.concatenateBarrs(HuamiServices.MB_PAIR_INIT, ProtocolManager.getAuthKey());
            Log.d(TAG,"pairingRequest: " + GenericUtils.bytesToHex(pairingRequest));
            characteristic.setValue(pairingRequest);
            bluetoothGatt.writeCharacteristic(characteristic);
            UIRenderer.renderAppImpersonation("(PAIRING) Sent new Auth Key", activity);
        } else if (value[0] == (byte) 0x10
                && value[1] == (byte) 0x01
                && value[2] == (byte) 0x01) {
            Log.d(TAG,"Pairing request OK");
            characteristic.setValue(HuamiServices.MB_PV1_ASK_CHALL);
            bluetoothGatt.writeCharacteristic(characteristic);
            UIRenderer.renderAppImpersonation("(PAIRING) User confirmed manual trigger", activity);
        } else if (value[0] == (byte) 0x10
                && value[1] == (byte) 0x02
                && value[2] == (byte) 0x04) {
            Log.d(TAG,"Hello challenge OK");
            Log.d(TAG,"Asking for challenge");
            characteristic.setValue(HuamiServices.MB_PV1_RND_REQ);
            bluetoothGatt.writeCharacteristic(characteristic);
            UIRenderer.renderAppImpersonation("(AUTH) Asking for Challenge", activity);
        } else if (value[0] == (byte) 0x10
                && value[1] == (byte) 0x02
                && value[2] == (byte) 0x01) {
            byte[] eValue = AuthenticationChallenge.AESAuth(value, getAuthKey());
            byte[] responseValue = GenericUtils.concatenateBarrs(HuamiServices.MB_PV1_CHALL_RESP, eValue);
            Log.d(TAG,"Sending encrypted number");
            characteristic.setValue(responseValue);
            bluetoothGatt.writeCharacteristic(characteristic);
            UIRenderer.renderAppImpersonation("(AUTH) Received Challenge", activity);
            UIRenderer.renderAppImpersonation("(AUTH) Sent Challenge Solution", activity);
        } else if (value[0] == (byte) 0x10
                && value[1] == (byte) 0x03
                && value[2] == (byte) 0x01) {
            Log.d(TAG,"Authentication successful");
            UIRenderer.renderAppImpersonation("(AUTH) Authentication End", activity);
            UIRenderer.renderAppImpersonationSuccess("Authentication successful", Color.BLUE, activity);
        } else if (value[0] == (byte) 0x10
                && value[1] == (byte) 0x03
                && value[2] == (byte) 0x04) {
            Log.d(TAG,"Authentication failure");
            UIRenderer.renderAppImpersonation("(AUTH) Authentication End", activity);
            UIRenderer.renderAppImpersonationSuccess("Authentication unsuccessful", Color.RED, activity);
            bluetoothGatt.disconnect();
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    protected static void mbp2Manager(BluetoothGattCharacteristic characteristic, BluetoothGattCharacteristic characteristicChunkedTransfer, byte[] value, BluetoothGatt bluetoothGatt, Activity activity) throws NoSuchAlgorithmException, BadPaddingException, NoSuchPaddingException, IllegalBlockSizeException, InvalidKeyException {

        String valrec = "";
        for (int i = 0; i < value.length; i++) {
            valrec = valrec + value[i] + " ";
        }

        if (value[0] == (byte) 0x10
                && value[1] == (byte) 0x01
                && value[2] == (byte) 0x81
                && value[3] == (byte) 0x01) {
            Log.d(TAG,"(PAIRING) pair_v2 + SHA1(pub_key): " + valrec);
            factoryReset(characteristic, bluetoothGatt, activity);
            // todo Pairing v2 not automated yet, after factory reset we are supposed to perform standard server-side pairing. This way, we retrieve a value that has to be sent in 4 packets to the Chunked Transfer characteristic
            /*
            // code here is correct, but does not properly work without full automation as factory reset disconnects, and the server-side pairing is not implemented yet
            characteristic.setValue(HuamiServices.MB_RND_REQ);
            bluetoothGatt.writeCharacteristic(characteristic);
            UIRenderer.renderAppImpersonation("(PAIRING) Sent rand_req", activity);
            */
        } else if (value[0] == (byte) 0x10
                && value[1] == (byte) 0x82
                && value[2] == (byte) 0x01) {
            if (!isSetAuthKey) {
                byte[] cutValue = Arrays.copyOfRange(value, 3, value.length);
                Log.d(TAG,"(PAIRING) rand_resp / pairing_key: " + cutValue);
                setAuthKey(cutValue);
                // todo perform server-side pairing
                byte[] chunk1 = GenericUtils.concatenateBarrs(HuamiServices.MB_SSP_PRE_CHUNK1, MB_SSP_CHUNK1);
                byte[] chunk2 = GenericUtils.concatenateBarrs(HuamiServices.MB_SSP_PRE_CHUNK2, MB_SSP_CHUNK2);
                byte[] chunk3 = GenericUtils.concatenateBarrs(HuamiServices.MB_SSP_PRE_CHUNK3, MB_SSP_CHUNK3);
                byte[] chunk4 = GenericUtils.concatenateBarrs(HuamiServices.MB_SSP_PRE_CHUNK4, MB_SSP_CHUNK4);
                GenericUtils.delayedAction(characteristicChunkedTransfer, bluetoothGatt, chunk1, 500);
                GenericUtils.delayedAction(characteristicChunkedTransfer, bluetoothGatt, chunk2, 1000);
                GenericUtils.delayedAction(characteristicChunkedTransfer, bluetoothGatt, chunk3, 1500);
                GenericUtils.delayedAction(characteristicChunkedTransfer, bluetoothGatt, chunk4, 2000);
                GenericUtils.delayedAction(characteristicChunkedTransfer, bluetoothGatt, HuamiServices.MB_SSP_CONFIRM_CHUNK5, 2500);
            } else {
                Log.d(TAG, "(PAIRING) rand_resp / auth_chal: " + value);
                byte[] eValue = AuthenticationChallenge.AESAuth(value, getAuthKey());
                byte[] responseValue = GenericUtils.concatenateBarrs(HuamiServices.MB_PV2_CHALL_RESP, eValue);
                Log.d(TAG, "Sending encrypted number");
                UIRenderer.renderAppImpersonation("(AUTH) Received Challenge", activity);
                characteristic.setValue(responseValue);
                bluetoothGatt.writeCharacteristic(characteristic);
                UIRenderer.renderAppImpersonation("(AUTH) Sent Challenge Solution", activity);
            }
        } else if (value[0] == (byte) 0x10
                && value[1] == (byte) 0x83
                && value[2] == (byte) 0x01) {
            if (!waitingForAuth) {
                Log.d(TAG, "OTA Pairing OK");
                UIRenderer.renderAppImpersonation("(PAIRING) User confirmed manual trigger", activity);
            } else {
                Log.d(TAG, "Authentication OK");
                UIRenderer.renderAppImpersonation("(AUTH) Authentication End", activity);
                UIRenderer.renderAppImpersonationSuccess("Authentication successful", Color.BLUE, activity);
            }
        } else if (value[0] == (byte) 0x10
                && value[1] == (byte) 0x01
                && value[2] == (byte) 0x01) {
            Log.d(TAG, "Server-side Pairing OK");
            UIRenderer.renderAppImpersonation("(PAIRING) Server-side pairing worked", activity);
            characteristic.setValue(HuamiServices.MB_PV2_RND_REQ);
            bluetoothGatt.writeCharacteristic(characteristic);
            UIRenderer.renderAppImpersonation("(AUTH) Sent rand_req", activity);
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    protected static void factoryReset(BluetoothGattCharacteristic characteristic, BluetoothGatt bluetoothGatt, Activity activity) {
        characteristic.setValue(HuamiServices.MB_F_RESET);
        bluetoothGatt.writeCharacteristic(characteristic);
        UIRenderer.renderAppImpersonation("Sent Factory Reset", activity);
    }

    private static void setAuthKey(byte[] value) {
        authKey = value;
        isSetAuthKey = true;
        Log.d(TAG, "setAuthKey: " + GenericUtils.bytesToHex(authKey));
    }

    private static byte[] getAuthKey() {
        if (isSetAuthKey) {
            return authKey;
        } else {
            return null;
        }
    }

}
