package breakmi;

import android.util.Log;

public class PrintCharacteristic {

    private static final String TAG = "PrintCharacteristic";

    public static String printRaw(byte[] value) {
        Log.d(TAG, "Raw: " + GenericUtils.bytesToHex(value));
        return GenericUtils.bytesToHex(value);
    }

    public static String printAuth(byte[] value) {
        Log.d(TAG, "Auth: " + GenericUtils.bytesToHex(value));
        return GenericUtils.bytesToHex(value);
    }

    public static String printSteps(byte[] value) {
        if (value == null) {
            Log.d(TAG, "Steps: Null");
            return String.valueOf(-1);
        }
        if (value.length == 13) {
            byte[] stepsValue = new byte[] {value[1], value[2]};
            int steps = GenericUtils.toUint16(stepsValue);
            Log.i(TAG,"Steps: " + steps);
            return String.valueOf(steps);
        } else {
            Log.w(TAG, "Unhandled Steps format: " + GenericUtils.formatBytes(value));
        }
        return String.valueOf(-1);
    }

    public static String printHeartRate(byte[] value) {
        if (value.length == 2 && value[0] == 0) {
            int hrValue = (value[1] & 0xff);
            Log.i(TAG, "Heart Rate: " + hrValue);
            return String.valueOf(hrValue);
        }
        return String.valueOf(-1);
    }

}
