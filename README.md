# BreakMi

## Description and Goals of BreakMi Toolkit

BreakMi is a security assessment toolkit for BLE fitness trackers. More specifically, it targets the application-layer protocols used by Mi Band devices (and other devices using the same protocols, such as the Amazfit Band), the [Zepp Life](https://play.google.com/store/apps/details?id=com.xiaomi.hm.health) (formerly Mi Fit) mobile app, and the [Zepp](https://play.google.com/store/apps/details?id=com.huami.watch.hmwatchmanager) (formerly Amazfit) app. The actual manufacturer of those devices and app is Huami, but, since Huami is part of the Xiaomi ecosystem, only Xiaomi will be mentioned. The toolkit also supports some Fitbit trackers, most notably the Charge 2. Due to the nature of BLE, it can be extended to other brands of fitness trackers, and to any other BLE device.

BreakMi implements three over-the-air attacks (Tracker Impersonation, App Impersonation, Man-in-the-Middle) and two Android remote software-based attacks (Eavesdropping, App Impersonation). The toolkit works with minimal resources: a computer, Python (+ libraries), Node.js (+ libraries), an Android phone (no root required), and a USB BLE dongle (in order to change BLE mac address for address spoofing). BreakMi also offers some additional features, such as scripts to interact with the trackers and the companion apps, Frida hooks and capture files.

To learn more about our work, please refer to the paper "BreakMi: Reversing, Exploiting and Fixing Xiaomi Fitness Tracking Ecosystem" published on TCHES 2022.

## (Update) New Xiaomi Auth Protocol

During 2021, Xiaomi started pushing a new firmware update for their fitness trackers (we confirmed this for Mi Band 5 and 6), that replaces the protocols we evaluated in this work with new ones. If a tracker is updated to that protocol, BreakMi should not work anymore, even though it might be possible to extend it to support the same attacks on the new protocol.

## OTA Attacks

The folder [*breakmi-ble*](https://github.com/Skiti/BreakMi/blob/main/breakmi-ble) contains [Bleno](https://github.com/noble/bleno) and [Noble](https://github.com/noble/noble) scripts that perform OTA Tracker Impersonation, App Impersonation and Man-in-the-Middle on Xiaomi fitness trackers.

* OTA Tracker Impersonation allows to create and spoof fitness trackers, and to send fake data to the legitimate companion app
* OTA App Impersonation allows to send any command to the legitimate fitness tracker, without overwriting pairing between them
* OTA Man-in-the-Middle allows complete control of the traffic between the legitimate fitness tracker and companion app, without overwriting pairing between them

For more details, please refer to [README.md](https://github.com/Skiti/BreakMi/blob/main/breakmi-ble/README.md).

## Remote Software-Based Attacks

The folder [*breakmi-app*](https://github.com/Skiti/BreakMi/blob/main/breakmi-app) contains the Android app that performs Remote SB Eavesdropping and Remote SB App Impersonation on Xiaomi and Fitbit fitness trackers.

* Remote SB Eavesdropping allows to monitor BLE packets involving Pairing, Authentication and Communication (Steps count and Heart Rate).
* Remote SB App Impersonation allows to monitor and edit BLE packets involving Pairing, Authentication and Communication (Steps count and Heart Rate).

For more details, please refer to [README.md](https://github.com/Skiti/BreakMi/blob/main/breakmi-app/README.md).

## Protocol Dissectors

The folder [*protocol-dissectors*](https://github.com/Skiti/BreakMi/blob/main/protocol-dissectors) contains a set of scripts that check the correct implementation of Xiaomi proprietary Pairing and Authentication protocols.

## Frida Hooks

The folder [*frida-hooks*](https://github.com/Skiti/BreakMi/blob/main/frida-hooks) contains a set of useful Frida hooks created while reverse-engineering Xiaomi application-layer proprietary protocols and developing BreakMi.
