# BreakMi

## Description and Goals of BreakMi Toolkit

BreakMi is a security assessment toolkit for BLE fitness trackers. More specifically, it targets the application-layer protocols used by Mi Band devices (and other devices using the same protocols, such as the Amazfit Band), the [Zepp Life](https://play.google.com/store/apps/details?id=com.xiaomi.hm.health) (formerly Mi Fit) mobile app, and the [Zepp](https://play.google.com/store/apps/details?id=com.huami.watch.hmwatchmanager) (formerly Amazfit) app. The actual manufacturer of those devices and app is Huami, but, since Huami is part of the Xiaomi ecosystem, only Xiaomi will be mentioned. The toolkit also supports some Fitbit trackers, most notably the Charge 2. Due to the nature of BLE, it can be extended to other brands of fitness trackers, and to any other BLE device.

BreakMi implements three over-the-air attacks (Tracker Impersonation, App Impersonation, Man-in-the-Middle) and two Android remote software-based attacks (Eavesdropping, App Impersonation). The toolkit works with minimal resources: a computer, Python (+ libraries), Node.js (+ libraries), an Android phone (no root required), and a USB BLE dongle (in order to change BLE mac address for address spoofing). BreakMi also offers some additional features, such as scripts to interact with the trackers and the companion apps, Frida hooks and capture files.

To learn more about our work, please read the paper "BreakMi: Reversing, Exploiting and Fixing Xiaomi Fitness Tracking Ecosystem" published on TCHES 2022.

## OTA Attacks

The folder [*breakmi-ble*](https://github.com/Skiti/BreakMi/blob/main/breakmi-ble) contains [Bleno](https://github.com/noble/bleno) and [Noble](https://github.com/noble/noble) scripts that perform OTA Tracker Impersonation, App Impersonation and Man-in-the-Middle on Xiaomi fitness trackers.

* OTA Tracker Impersonation allows to create and spoof fitness trackers, and to send fake data to the legitimate companion app.
* OTA App Impersonation allows to send any command to the legitimate fitness tracker, without overwriting pairing between them.
* OTA Man-in-the-Middle allows complete control of the traffic between the legitimate fitness tracker and companion app, without overwriting pairing between them.

For more details, please refer to [README.md](https://github.com/Skiti/BreakMi/blob/main/breakmi-ble/README.md).

### OTA Video Demos (Xiaomi)

Video demonstration of the Tracker Impersonation on Mi Band 5:

[![demo3](http://img.youtube.com/vi/wBRDpL5WVsw/0.jpg)](http://www.youtube.com/watch?v=wBRDpL5WVsw)

Video demonstration of the Central Impersonation on Zepp Life and Mi Band 5:

[![demo4](http://img.youtube.com/vi/3728qE_WOt8/0.jpg)](http://www.youtube.com/watch?v=3728qE_WOt8)

Video demonstration of the Man-in-the-Middle on Zepp Life and Mi Band 5:

[![demo5](http://img.youtube.com/vi/bUaY1kW6J7A/0.jpg)](http://www.youtube.com/watch?v=bUaY1kW6J7A)

### OTA Video Demos (Fitbit)

Video demonstration of the BLE Address Spoofing on Fitbit Charge 2:

[![demo6](http://img.youtube.com/vi/_f5I8_xmTzs/0.jpg)](https://youtu.be/_f5I8_xmTzs)

Video demonstration of the Peripheral Impersonation on Fitbit Charge 2:

[![demo7](http://img.youtube.com/vi/-EzbmsfTOSU/0.jpg)](https://youtu.be/-EzbmsfTOSU)

Video demonstration of the App Impersonation on Fitbit Charge 2:

[![demo8](http://img.youtube.com/vi/pYcxr5NyOSI/0.jpg)](https://youtu.be/pYcxr5NyOSI)

## Remote Software-Based Attacks

The folder [*breakmi-app*](https://github.com/Skiti/BreakMi/blob/main/breakmi-app) contains the Android app that performs Remote SB Eavesdropping and Remote SB App Impersonation on Xiaomi and Fitbit fitness trackers.

* Remote SB Eavesdropping allows to monitor BLE packets involving Pairing, Authentication and Communication (Steps count and Heart Rate).
* Remote SB App Impersonation allows to monitor and edit BLE packets involving Pairing, Authentication and Communication (Steps count and Heart Rate).

For more details, please refer to [README.md](https://github.com/Skiti/BreakMi/blob/main/breakmi-app/README.md).

### SB Video Demos (Xiaomi)

Video demonstration of the SB Eavesdropping on Mi Band 5:

[![demo1](http://img.youtube.com/vi/EWrDKHXjnJw/0.jpg)](http://www.youtube.com/watch?v=EWrDKHXjnJw)

Video demonstration of Server-Side Pairing on Mi Band 5:

[![demo2](http://img.youtube.com/vi/Hqcz2PmP7JI/0.jpg)](http://www.youtube.com/watch?v=Hqcz2PmP7JI)

## Protocol Dissectors

The folder [*protocol-dissectors*](https://github.com/Skiti/BreakMi/blob/main/protocol-dissectors) contains a set of scripts that check the correct implementation of Xiaomi proprietary Pairing and Authentication protocols.

## Frida Hooks

The folder [*frida-hooks*](https://github.com/Skiti/BreakMi/blob/main/frida-hooks) contains a set of useful Frida hooks created while reverse-engineering Xiaomi application-layer proprietary protocols and developing BreakMi.
