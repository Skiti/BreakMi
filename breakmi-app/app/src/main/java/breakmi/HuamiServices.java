package breakmi;

import java.util.UUID;

public class HuamiServices {

    // UUIDs
    public static final String BASE_UUID = "0000%s-0000-1000-8000-00805f9b34fb";

    public static final UUID UUID_SERVICE_HUAMI0 = UUID.fromString(String.format(BASE_UUID, "FEE0"));
    public static final UUID UUID_SERVICE_HUAMI1 = UUID.fromString(String.format(BASE_UUID, "FEE1"));

    public static final UUID UUID_SERVICE_HEARTRATE = UUID.fromString(String.format(BASE_UUID, "180D"));

    public static final UUID UUID_CHARACTERISTIC_STEPS = UUID.fromString("00000007-0000-3512-2118-0009af100700");
    public static final UUID UUID_CHARACTERISTIC_AUTH = UUID.fromString("00000009-0000-3512-2118-0009af100700");

    public static final UUID UUID_CHARACTERISTIC_HR_CONTROLPOINT = UUID.fromString("00002a39-0000-1000-8000-00805f9b34fb");
    public static final UUID UUID_CHARACTERISTIC_HR_MEASUREMENT = UUID.fromString("00002a37-0000-1000-8000-00805f9b34fb");

    public static final UUID UUID_CHARACTERISTIC_CLIENT_CONFIG = UUID.fromString("00002902-0000-1000-8000-00805f9b34fb");

    public static final UUID UUID_CHARACTERISTIC_CHUNKED_TRANSFER = UUID.fromString("00000020-0000-3512-2118-0009af100700");

    // opcodes
    public static final byte[] MB_PAIR_INIT = new byte[] { 0x01, 0x00 };
    public static final byte[] MB_PV1_ASK_CHALL = new byte[] { 0x02, 0x00, 0x02 };
    public static final byte[] MB_PV1_CHALL_RESP = new byte[] { 0x03, 0x00 };
    public static final byte[] MB_PV2_CHALL_RESP = new byte[] { (byte) 0x83, 0x00 };
    public static final byte[] MB_PV1_RND_REQ = new byte[] { 0x02, 0x00 };
    public static final byte[] MB_PV2_RND_REQ = new byte[] { (byte) 0x82, 0x00, 0x02 };
    public static final byte[] MB_F_RESET = new byte[] { 0x06, 0x0b, 0x00, 0x01 };
    public static final byte[] MB_SSP_PRE_CHUNK1 = new byte[] { 0x00, 0x04, 0x00, (byte) 0x83, 0x00 };
    public static final byte[] MB_SSP_PRE_CHUNK2 = new byte[] { 0x00, 0x44, 0x01 };
    public static final byte[] MB_SSP_PRE_CHUNK3 = new byte[] { 0x00, 0x44, 0x02 };
    public static final byte[] MB_SSP_PRE_CHUNK4 = new byte[] { 0x00, 0x44, 0x03 };
    public static final byte[] MB_SSP_CONFIRM_CHUNK5 = new byte[] { 0x00, (byte) 0x84, 0x04, 0x00, 0x00 };

}
