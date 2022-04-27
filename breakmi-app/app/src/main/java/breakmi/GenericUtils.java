package breakmi;

import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCharacteristic;
import android.os.Build;
import android.os.Handler;

import androidx.annotation.RequiresApi;

public class GenericUtils {

    public static String formatBytes(byte[] bytes) {
        if (bytes == null) {
            return "(null)";
        }
        StringBuilder builder = new StringBuilder(bytes.length * 5);
        for (byte b : bytes) {
            builder.append(String.format("0x%02x", b));
            builder.append(" ");
        }
        return builder.toString().trim();
    }

    public static String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte aByte : bytes) {
            result.append(String.format("%02x", aByte));
        }
        return result.toString();
    }

    public static byte[] hexStringToByteArray(String s) {
        int len = s.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
                    + Character.digit(s.charAt(i+1), 16));
        }
        return data;
    }

    public static byte[] concatenateBarrs(byte[] barr1, byte[] barr2) {
        byte[] destination = new byte[barr1.length + barr2.length];
        System.arraycopy(barr1, 0, destination, 0, barr1.length);
        System.arraycopy(barr2, 0, destination, barr1.length, barr2.length);
        return destination;
    }

    public static int toUint16(byte... bytes) {
        return (bytes[0] & 0xff) | ((bytes[1] & 0xff) << 8);
    }

    public static void delayedAction(final BluetoothGattCharacteristic characteristic, final BluetoothGatt bluetoothGatt, final byte[] value, final int delay) {
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
            @Override
            public void run() {
                    characteristic.setValue(value);
                bluetoothGatt.writeCharacteristic(characteristic);
            }
        }, delay);
    }

}
