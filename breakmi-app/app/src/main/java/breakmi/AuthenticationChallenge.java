package breakmi;

import android.util.Log;

import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;

public class AuthenticationChallenge {

    private static final String TAG = "AuthenticationChallenge";

    public static String performPairing(String blemac, byte[] random_bArr) {
        String authkey = "None";

        // ** PHASE 1 - Merging BLE MAC Address and Random Value **

        String[] split = blemac.split(":");
        byte[] blemac_bArr = new byte[random_bArr.length + split.length];
        int i = 0;
        while (i < split.length) {
            blemac_bArr[i] = Integer.decode("0x" + split[i]).byteValue();
            i++;
        }
        System.arraycopy(random_bArr, 0, blemac_bArr, i, random_bArr.length);

        String blemachex = GenericUtils.bytesToHex(blemac_bArr);
        Log.e(TAG, "Blemachex: " + blemachex);

        // ** PHASE 2 - Hashing with SHA-256 **
        byte[] digest;

        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(blemac_bArr);
            digest = md.digest();

            String hexdigest = GenericUtils.bytesToHex(digest);
            Log.e(TAG, "Hexdigest: " + hexdigest);

            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < 16; j++) {
                sb.append(String.format("%02X", digest[j]));
            }

            authkey = sb.toString();
            Log.d(TAG, "Authkey: " + authkey);

        } catch (NoSuchAlgorithmException e) {}

        return authkey;
    }

    public static String computeChallenge(String authkey, byte[] bArr_challenge) {
        byte[] bArr_solution;
        String solution = "None";

        byte[] a = GenericUtils.hexStringToByteArray(authkey);

        SecretKeySpec key = new SecretKeySpec(a, "AES");
        Cipher cipher;
        try {
            cipher = Cipher.getInstance("AES/ECB/NoPadding");
            cipher.init(Cipher.ENCRYPT_MODE, key);
            bArr_solution = cipher.doFinal(bArr_challenge);
            String barrhexsolution = GenericUtils.bytesToHex(bArr_solution);
            Log.i(TAG, "Barrhexsolution: " + barrhexsolution);
        } catch (NoSuchAlgorithmException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (NoSuchPaddingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (InvalidKeyException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IllegalBlockSizeException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (BadPaddingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return solution;
    }

    public static byte[] AESAuth(byte[] value, byte[] secretKey) throws InvalidKeyException, NoSuchPaddingException, NoSuchAlgorithmException, BadPaddingException, IllegalBlockSizeException {
        byte[] mValue = Arrays.copyOfRange(value, 3, 19);
        Cipher ecipher = Cipher.getInstance("AES/ECB/NoPadding");
        SecretKeySpec newKey = new SecretKeySpec(secretKey, "AES");
        ecipher.init(Cipher.ENCRYPT_MODE, newKey);
        byte[] enc = ecipher.doFinal(mValue);
        return enc;
    }

}
