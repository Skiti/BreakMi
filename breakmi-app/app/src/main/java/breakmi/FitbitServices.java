package breakmi;

import java.util.UUID;

public class FitbitServices {

    // UUIDs
    public static final String BASE_UUID = "0000%s-0000-1000-8000-00805f9b34fb";

    public static final UUID UUID_SERVICE_PAIRING = UUID.fromString("adabfb00-6e7D-4601-bda2-bffaa68956ba");
    public static final UUID UUID_SERVICE_COMMUNICATION = UUID.fromString("558dfa00-4fa8-4105-9f02-4eaa93e62980");

    public static final UUID UUID_CHARACTERISTIC_COMMUNICATION = UUID.fromString("558dfa01-4fa8-4105-9f02-4eaa93e62980");
    public static final UUID UUID_CHARACTERISTIC_PAIRING = UUID.fromString("adabfb02-6e7D-4601-bda2-bffaa68956ba");

    // opcodes
    public static final byte[] MB2_PAIR_INIT = new byte[] { 0x01, 0x00 };

}
