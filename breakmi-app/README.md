# BreakMi Remote Software-Based Attacks

The BreakMi app supports two Remote Software-Based attacks: Eavesdropping and Central Impersonation.
Through Eavesdropping, the BreakMi app will print protected data from the Auth, Steps and Heart Rate characteristics.
Through Central Impersonation, the BreakMi app will impersonate the legitimate companion app and send custom commands to the BLE peripheral.
The APK file for the app can be found in [breakmi.apk](https://github.com/Skiti/BreakMi/blob/main/breakmi-app/breakmi.apk), our built directly from the Android Studio project.

## Prerequisites and Setup

* Mobile phone running Android lower than version 12 (WIP Android 12)
* Installation of Zepp Life or Zepp companion app
* Installation of BreakMi app
* Fitness tracker compatible with the attacks as a BLE peripheral (e.g., Mi Band 2, Mi Band 3, Amazfit Band 2, Mi Band 4, Mi Band 5, Fitbit Charge 2)
* Legitimate pairing between the peripheral and the companion app

## Attacks Execution

### Xiaomi Protocol v1 (Mi Band 2, Mi Band 3, Amazfit Band 2)

Instructions for Eavesdropping and Central Impersonation:
* Open the companion app
* Make sure the BLE peripheral is currently connected to the app
* Open BreakMi app
* Detect the connected peripheral
* Deploy the preferred attack in a fully automated way

During Central Impersonation, BreakMi will re-pair with the tracker (not necessary if the Pairing Key was previously sniffed), thus posing as a trusted app and gaining full access to protected characteristics. Since in Android the BLE channel is shared between apps, the legitimate app will still regularly receive data from the peripheral, even though its Pairing Key is now obsolete.

### Xiaomi Protocol v2 (Mi Band 4, Mi Band 5, Mi Band 6)

Instructions for Eavesdropping and Central Impersonation:
* Open the companion app
* Make sure the BLE peripheral is currently connected to the app
* Open BreakMi app
* Detect the connected peripheral
* Deploy the Eavesdropping attack in a fully automated way, or follow the additional instructions below to deploy the Central Impersonation attack

BreakMi does not implement yet a fully automated Central Impersonation on Xiaomi Protocol v2. This is how to manually perform the attack:
* Deploy the Central Impersonation attack, which actually sends a factory reset command to the peripheral
* Pair the peripheral with another Xiaomi account, using custom scripts or a companion app
* Get full access to the peripheral's protected characteristics

The implementation of a fully automated Central Impersonation on BreakMi is feasible, but it's currently a work-in-progress.
BreakMi lacks a full implementation of Pairing v2. The BLE logic is already available in the code, but unused as the Server-Side logic was not written yet.
Pairing v2 requires a special value created by Xiaomi backend, at the end of Xiaomi Server-Side Pairing. BreakMi is missing the component that autonomously communicates with Xiaomi backend, and then sends back to the peripheral the special value, to complete Pairing v2.
The API requests required to manually perform Xiaomi Server-Side Pairing backend can be found in [xiaomi-pairv2-webrequests.md](https://github.com/Skiti/BreakMi/blob/main/breakmi-app/xiaomi-pairv2-webrequests.md).

Video demonstration of the Central Impersonation on Mi Band 5:

[![demo1](http://img.youtube.com/vi/EWrDKHXjnJw/0.jpg)](http://www.youtube.com/watch?v=EWrDKHXjnJw)

Video demonstration of the Central Impersonation on Mi Band 5:

[![demo2](http://img.youtube.com/vi/Hqcz2PmP7JI/0.jpg)](http://www.youtube.com/watch?v=Hqcz2PmP7JI)

### Fitbit Charge 2 Protocol (Charge 2 and its predecessors)

Instructions for Eavesdropping:
* Open the companion app
* Make sure the BLE peripheral is currently connected to the app
* Open BreakMi app
* Detect the connected peripheral
* Deploy the Eavesdropping attack in a fully automated way, or follow the additional instructions below to deploy the Central Impersonation attack

BreakMi does not implement yet a fully automated Central Impersonation on Fitbit Charge 2 Protocol. This is how to manually perform the attack, outside the BreakMi app:
* Perform Fitbit Server-Side Pairing by sending the web requests to Fitbit backend found in [fitbit-webrequests.md](https://github.com/Skiti/BreakMi/blob/main/breakmi-app/fitbit-webrequests.md), after filling them with the login credentials of a malicious Fitbit account
* Pair the peripheral with the malicious Fitbit account using the Fitbit companion app
* Get full access to the peripheral's protected characteristics

The implementation of this attack in BreakMi is feasible, but it's currently a work-in-progress.
