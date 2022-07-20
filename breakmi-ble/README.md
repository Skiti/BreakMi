# BreakMi Over-the-Air Attacks

## Prerequisites

* Mobile phone running Android
* Installation of Zepp Life or Zepp companion app (we tested Mi Fit version 4.8.1, which was then renamed to Zepp Life, and Zepp version 5.9.2, but the attacks target Android and the application-layer protocol so they are independent from the app version)
* Fitness tracker compatible with the attacks as a BLE peripheral (e.g., Mi Band 2, Mi Band 3, Amazfit Band 2, Mi Band 4, Mi Band 5, Fitbit Charge 2)
* Fitness tracker not updated to the new Xiaomi protocols deployed from 2021 onwards
* Legitimate pairing between the peripheral and the companion app
* Attacking machine with administrative privileges (our instructions refer to Ubuntu distributions, but Windows and iOS should work as they are compatible with Bleno and Noble and should allow for changes to the BLE interface)
* Installation of [Bleno](https://github.com/noble/bleno) vewrsion 0.5.0 and [Noble](https://github.com/noble/noble) version 1.9.1 modules
* Installation of [Node](https://nodejs.org/en/) version 8.9.0 for compatibility issues with the *bluetooth-hci-socket* module used by Bleno and Noble
  - Node version can be downgraded through nvm (`npm install nvm`,`nvm install 8.9.0`,`nvm use 8.9.0`)
* Installation of [Socket.io](https://socket.io/), and port 3000/3001 free (can be edited)
* Any Bluetooth 4.2+ interface for Central Impersonation (the default one on the machine is sufficient)
* Any Bluetooth 4.2+ interface able to perform BLE address spoofing to achieve Tracker Impersonation
  - BLE address spoofing through [`bdaddr`](https://github.com/thxomas/bdaddr)
* Capture of a BLE advertisement from the victim device to copy the advertisement and BLE MAC address (we recommend using the NRFConnect app to read the raw advertisement value regularly emitted by the tracker when not connected)

## Attacks' Execution (Xiaomi)

### Peripheral (Tracker) Impersonation Attack

Instructions for Peripheral Impersonation:
* The peripheral (tracker) is currently not connected to the app
* The attacker's machine is near both the peripheral and the mobile phone (running the Zepp Life or Zepp companion app)
* Use `./bdaddr 11:22:33:44:55:66` to spoof the target tracker's BLE MAC address (previously collected using NRFConnect)
* Run `sudo systemctl stop bluetooth`, and then `sudo hciconfig hciN up` where N is the interface with the BLE spoofed address (otherwise the attack might fail because of how Bleno and Noble work)
* Run `sudo BLENO_HCI_DEVICE_ID=N node breakmi.js`, select Peripheral Impersonation (option 1), and then the target device model
* The machine will become a BLE peripheral, and will behave as one (during Pairing, Authentication and Communication)
* Open the legitimate app that should automatically connect to the spoofed peripheral, instead of the legitimate one (stronger BLE signal)
* The app fully trusts the spoofed peripheral

[![demo1](http://img.youtube.com/vi/wBRDpL5WVsw/0.jpg)](http://www.youtube.com/watch?v=wBRDpL5WVsw)

### Central (App) Impersonation Attack

Instructions for Central Impersonation:
* The tracker is currently not connected to the app (recommended to turn Bluetooth off on the mobile phone)
* The attacker's machine is near both the tracker and the mobile phone (running the Zepp Life or Zepp companion app)
* Use `./bdaddr 11:22:33:44:55:66` to spoof the target tracker's BLE MAC address (previously collected using NRFConnect)
* Run `sudo systemctl stop bluetooth`, `sudo hciconfig hciM up` and `sudo hciconfig hciN up` where interface N is the one spoofing the tracker (otherwise the attack might fail because of how Bleno and Noble work)
* Run `sudo NOBLE_HCI_DEVICE_ID=M node breakmi.js`, select Central Impersonation (option 2), and then Central Side (option 1)
* Scan and connect to the legitimate peripheral
* Run `sudo BLENO_HCI_DEVICE_ID=N node breakmi.js`, select Central Impersonation (option 2), and then Peripheral Side (option 2)
* Open the companion app (enable Bluetooth on the mobile phone), and let the app connect to the spoofed peripheral
* Let the Authentication protocol run, afterwards the spoofed peripheral can be turned off
* Read data from the protected characteristics of the legitimate BLE peripheral

[![demo2](http://img.youtube.com/vi/3728qE_WOt8/0.jpg)](http://www.youtube.com/watch?v=3728qE_WOt8)

### Man-in-the-Middle Attack

Instructions for Man-in-the-Middle:
* The tracker is currently not connected to the app (recommended to turn Bluetooth off on the mobile phone)
* The attacker's machine is near both the tracker and the mobile phone (running the Zepp Life or Zepp companion app)
* Use `./bdaddr 11:22:33:44:55:66` to spoof the target tracker's BLE MAC address (previously collected using NRFConnect)
* Run `sudo systemctl stop bluetooth`, `sudo hciconfig hciM up` and `sudo hciconfig hciN up` where interface N is the one spoofing the tracker (otherwise the attack might fail because of how Bleno and Noble work)
* Run `sudo NOBLE_HCI_DEVICE_ID=M node breakmi.js`, select Man-in-the-Middle (option 3), and then Central Side (option 1)
* Scan and connect to the legitimate peripheral
* Run `sudo BLENO_HCI_DEVICE_ID=N node breakmi.js`, select Man-in-the-Middle (option 3), and then Peripheral Side (option 2)
* Open the companion app (enable Bluetooth on the mobile phone), and let the app connect to the spoofed peripheral
* Let the Authentication protocol run
* Start a workout session on the legitimate app
* Start a workout session on the legitimate peripheral
* The app will show a fake heart rate that was increased by 100 compared to the one shown by the peripheral

[![demo3](http://img.youtube.com/vi/bUaY1kW6J7A/0.jpg)](http://www.youtube.com/watch?v=bUaY1kW6J7A)

## Attacks Execution (Fitbit)

### Fitbit-specific Setup

Fitbit trackers utilize a random static address. Thus, BLE address spoofing requires the additional steps described below:
* Use `sudo btmgmt` to edit Bluetooth settings, and use `select N` to select the BLE interface that will perform BLE spoofing, where N is the same as in the`sudo BLENO_HCI_DEVICE_ID=N node breakmi.js` command
* Use `power off` to temporarily turn off the BLE controller
* Change Bluetooth settings to *current settings: connectable discoverable bondable le*, using commands such as `bredr off` and `discov on`
* Set the static address with `static-addr XX:XX:XX:XX:XX:XX`, where the address is the same as the target Fitbit tracker address
* Use `power on` to turn on again the BLE controller
* Go to the [*hci.js*](https://github.com/Skiti/BreakMi/blob/main/breakmi-ble/bleno/lib/hci-socket/hci.js) file
* Edit line 291, from `cmd.writeUInt8(0x00, 9);` to `cmd.writeUInt8(0x01, 9);`
* Edit line 292, from `cmd.writeUInt8(0x00, 10);` to `cmd.writeUInt8(0x01, 10);`

[![demo4](http://img.youtube.com/vi/_f5I8_xmTzs/0.jpg)](https://youtu.be/_f5I8_xmTzs)

With this setup, BreakMi will be able to perform BLE address spoofing on Fitbit trackers. The changes on the BLE controller can be reverted by restarting the controller, or the machine. The changes on [*hci.js*](https://github.com/Skiti/BreakMi/blob/main/breakmi-ble/bleno/lib/hci-socket/hci.js) have to be manually reverted by editing the two aforementioned lines of code. Attacks on Xiaomi tracker will *NOT* work using Fitbit settings, and viceversa. If the error "Command Disallowed" appears, try running `advertising on` and then `advertising off` to fix it.

### Fitbit Peripheral (Tracker) Impersonation Attack

Instructions for Fitbit Peripheral Impersonation:
* The Fitbit peripheral (tracker) is currently not connected to the Fitbit app
* The attacker's machine is near both the peripheral and the mobile phone (running the Fitbit companion app)
* Run `sudo systemctl stop bluetooth`, and then `sudo hciconfig hciN up` where N is the interface with the BLE spoofed address (otherwise the attack might fail because of how Bleno and Noble work)
* Follow the instructions described in the *Fitbit-specific Setup* section to perform BLE address spoofing for Fitbit
* Run `sudo BLENO_HCI_DEVICE_ID=N node breakmi.js`, select Peripheral Impersonation (option 1), and then the target Fitbit device model
* The machine will become a BLE peripheral
* Open the legitimate app that should automatically connect to the spoofed peripheral, instead of the legitimate one (stronger BLE signal)
* Fitbit peripheral logic is currently a work-in-progress

[![demo5](http://img.youtube.com/vi/-EzbmsfTOSU/0.jpg)](https://youtu.be/-EzbmsfTOSU)

### Fitbit Central (App) Impersonation Attack

Instructions for Fitbit Central Impersonation:
* The Fitbit tracker is currently not connected to the Fitbit app (recommended to turn Bluetooth off on the mobile phone)
* The attacker's machine is near both the tracker and the mobile phone (running the Fitbit companion app)
* Run `sudo systemctl stop bluetooth`, `sudo hciconfig hciM up` and `sudo hciconfig hciN up` where interface N is the one spoofing the tracker (otherwise the attack might fail because of how Bleno and Noble work)
* Follow the instructions described in the *Fitbit-specific Setup* section to perform BLE address spoofing for Fitbit
* Run `sudo NOBLE_HCI_DEVICE_ID=M node breakmi.js`, select Central Impersonation (option 2), and then Central Side (option 1)
* Scan and connect to the legitimate peripheral
* Run `sudo BLENO_HCI_DEVICE_ID=N node breakmi.js`, select Central Impersonation (option 2), and then Peripheral Side (option 2)
* Open the companion app (enable Bluetooth on the mobile phone), and let the app connect to the spoofed peripheral
* Let the Authentication protocol run, afterwards the spoofed peripheral can be turned off
* Select Notify Info (option 1), walk while wearing the tracker and uncencrypted Live Data info notification will appear (e.g., the fifth byte is the step count in hex format)

[![demo6](http://img.youtube.com/vi/pYcxr5NyOSI/0.jpg)](https://youtu.be/pYcxr5NyOSI)

### Fitbit Man-in-the-Middle Attack

Instructions for Fitbit Man-in-the-Middle:
* The tracker is currently not connected to the app (recommended to turn Bluetooth off on the mobile phone)
* The attacker's machine is near both the tracker and the mobile phone (running the Fitbit companion app)
* Use `./bdaddr 11:22:33:44:55:66` to spoof the target tracker's BLE MAC address (previously collected using NRFConnect)
* Run `sudo systemctl stop bluetooth`, `sudo hciconfig hciM up` and `sudo hciconfig hciN up` where interface N is the one spoofing the tracker (otherwise the attack might fail because of how Bleno and Noble work)
* Run `sudo NOBLE_HCI_DEVICE_ID=M node breakmi.js`, select Man-in-the-Middle (option 3), and then Central Side (option 1)
* Scan and connect to the legitimate peripheral
* Run `sudo BLENO_HCI_DEVICE_ID=N node breakmi.js`, select Man-in-the-Middle (option 3), and then Peripheral Side (option 2)
* Open the companion app (enable Bluetooth on the mobile phone), and let the app connect to the spoofed peripheral
* Let the Authentication protocol run
* The attacker has a Man-in-the-Middle position
* Fitbit mitm logic is currently a work-in-progress

## File Explanation

The file [breakmi.js](https://github.com/Skiti/BreakMi/blob/main/breakmi-ble/breakmi.js) is the starting part of the BreakMi BLE tool, and it redirects the user to one of the attacks available.

The file [impersonation-central-cside](https://github.com/Skiti/BreakMi/blob/main/breakmi-ble/impersonation-central-cside.js) deploys the central side of the Central Impersonation attack. It scans for a target fitness tracker, performs service discovery, implements the attack for Xiaomi and Fitbit, and exploits the Communication protocol. This script exchanges messages with the peripheral side of the same attack using websockets.

The file [impersonation-central-pside](https://github.com/Skiti/BreakMi/blob/main/breakmi-ble/impersonation-central-pside.js) deploy the peripheral side of the Central Impersonation attack. It creates a spoofed tracker that implements the Xiaomi or Fitbit logic on its characteristics. This script exchanges messages with the central  side of the same attack using websockets.

The file [mitm-cside](https://github.com/Skiti/BreakMi/blob/main/breakmi-ble/mitm-cside.js) deploys the central side of the Man-in-the-Middle attack. It scans for a target fitness tracker, performs service discovery and relays the BLE traffic to the legitimate tracker while exchanging messages with the peripheral side of the MitM using websockets.

The file [mitm-pside](https://github.com/Skiti/BreakMi/blob/main/breakmi-ble/mitm-pside.js) deploys the peripheral side of the Man-in-the-Middle attack. It creates a spoofed tracker that implements the Xiaomi or Fitbit logic on its characteristics, and relays the BLE traffic to the legitimate companion app while exchanging messages with the peripheral side of the MitM using websockets.

The folder [peripheral_implementation](https://github.com/Skiti/BreakMi/tree/main/breakmi-ble/peripheral-implementation) contains the actual implementation (i.e., services, characteristics, and their logic) of the target fitness trackers (i.e., Mi Band 2/3/4/5, Amazfit Cor 2, Fitbit Charge 2). It also contains the advertising data for each of them.

The folder [bleno](https://github.com/Skiti/BreakMi/tree/main/breakmi-ble/bleno) contains the code for the Bleno node.js library, necessary to create a spoofed tracker. Normally, the source code would not be required, but for the attacks on Fitbit we need to use a BLE static random address; something only achievable by changing some values inside Bleno's code.

The folder [node_modules](https://github.com/Skiti/BreakMi/tree/main/breakmi-ble/node_modules) contains pre-downloaded node modules that should make it easier for the user to simply execute our code. Depending on your setup (i.e., Node.js version), you might see additional warnings/errors while executing BreakMi.

# BreakMi Over-the-Air Attacks

## Prerequisites

* Mobile phone running Android
* Installation of Zepp Life or Zepp companion app
* Fitness tracker compatible with the attacks as a BLE peripheral (e.g., Mi Band 2, Mi Band 3, Amazfit Band 2, Mi Band 4, Mi Band 5, Fitbit Charge 2)
* Legitimate pairing between the peripheral and the companion app
* Attacking machine with administrative privileges
* Installation of [Bleno](https://github.com/noble/bleno) and [Noble](https://github.com/noble/noble) modules
* Installation of [Node](https://nodejs.org/en/) version 8.9.0 for compatibility issues with the *bluetooth-hci-socket* module used by Bleno and Noble
  - Node version can be downgraded through nvm (`npm install nvm`,`nvm install 8.9.0`,`nvm use 8.9.0`)
* Installation of [Socket.io](https://socket.io/), and port 3000/3001 free (can be edited)
* Any Bluetooth interface for Central Impersonation (the default one on the machine is sufficient)
* Any Bluetooth interface able to perform BLE address spoofing to achieve Tracker Impersonation
  - BLE address spoofing through [`bdaddr`](https://github.com/thxomas/bdaddr)
* Capture of a BLE advertisement from the victim device (to copy the advertisement and BLE address)

## Attacks Execution (Xiaomi)

### Peripheral (Tracker) Impersonation Attack

Instructions for Peripheral Impersonation:
* The peripheral (tracker) is currently not connected to the app
* The attacker's machine is near both the peripheral and the mobile phone (running the companion app)
* Use `bdaddr` to spoof the machine BLE address
* Run `sudo systemctl stop bluetooth`, and then `sudo hciconfig hciN up` where N is the interface with the BLE spoofed address (otherwise the attack might fail because of how Bleno and Noble work)
* Run `sudo BLENO_HCI_DEVICE_ID=N node breakmi.js`, select Peripheral Impersonation (option 1), and then the target device model
* The machine will become a BLE peripheral, and will behave as one (during Pairing, Authentication and Communication)
* Open the legitimate app that should automatically connect to the spoofed peripheral, instead of the legitimate one (stronger BLE signal)
* The app fully trusts the spoofed peripheral

Video demonstration of the Tracker Impersonation on Mi Band 5:

[![demo3](http://img.youtube.com/vi/wBRDpL5WVsw/0.jpg)](http://www.youtube.com/watch?v=wBRDpL5WVsw)

### Central (App) Impersonation Attack

Instructions for Central Impersonation:
* The tracker is currently not connected to the app (recommended to turn Bluetooth off on the mobile phone)
* The attacker's machine is near both the tracker and the mobile phone (running the companion app)
* Use `bdaddr` to spoof the machine BLE address
* Run `sudo systemctl stop bluetooth`, `sudo hciconfig hciM up` and `sudo hciconfig hciN up` (otherwise the attack might fail because of how Bleno and Noble work)
* Run `sudo NOBLE_HCI_DEVICE_ID=M node breakmi.js`, select Central Impersonation (option 2), and then Central Side (option 1)
* Scan and connect to the legitimate peripheral
* Run `sudo BLENO_HCI_DEVICE_ID=N node breakmi.js`, select Central Impersonation (option 2), and then Peripheral Side (option 2)
* Open the companion app (enable Bluetooth on the mobile phone), and let the app connect to the spoofed peripheral
* Let the Authentication protocol run, afterwards the spoofed peripheral can be turned off
* Read data from the protected characteristics of the legitimate BLE peripheral

Video demonstration of the Central Impersonation on Zepp Life and Mi Band 5:

[![demo4](http://img.youtube.com/vi/3728qE_WOt8/0.jpg)](http://www.youtube.com/watch?v=3728qE_WOt8)

### Man-in-the-Middle Attack

Instructions for Man-in-the-Middle:
* The tracker is currently not connected to the app (recommended to turn Bluetooth off on the mobile phone)
* The attacker's machine is near both the tracker and the mobile phone (running the companion app)
* Use `bdaddr` to spoof the machine BLE address
* Run `sudo systemctl stop bluetooth`, `sudo hciconfig hciM up` and `sudo hciconfig hciN up` (otherwise the attack might fail because of how Bleno and Noble work)
* Run `sudo NOBLE_HCI_DEVICE_ID=M node breakmi.js`, select Man-in-the-Middle (option 3), and then Central Side (option 1)
* Scan and connect to the legitimate peripheral
* Run `sudo BLENO_HCI_DEVICE_ID=N node breakmi.js`, select Man-in-the-Middle (option 3), and then Peripheral Side (option 2)
* Open the companion app (enable Bluetooth on the mobile phone), and let the app connect to the spoofed peripheral
* Let the Authentication protocol run
* Start a workout session on the legitimate app
* Start a workout session on the legitimate peripheral
* The app will show a fake heart rate that was increased by 100 compared to the one shown by the peripheral

Video demonstration of the Man-in-the-Middle on Zepp Life and Mi Band 5:

[![demo5](http://img.youtube.com/vi/bUaY1kW6J7A/0.jpg)](http://www.youtube.com/watch?v=bUaY1kW6J7A)

## Attacks Execution (Fitbit)

### Fitbit-specific Setup

Fitbit trackers utilize a random static address. Thus, BLE address spoofing requires the additional steps described below:
* Use `sudo btmgmt` to edit Bluetooth settings, and use `select N` to select the BLE interface that will perform BLE spoofing, where N is the same as in the`sudo BLENO_HCI_DEVICE_ID=N node breakmi.js` command
* Use `power off` to temporarily turn off the BLE controller
* Change Bluetooth settings to *current settings: connectable discoverable bondable le*, using commands such as `bredr off` and `discov on`
* Set the static address with `static-addr XX:XX:XX:XX:XX:XX`, where the address is the same as the target Fitbit tracker address
* Use `power on` to turn on again the BLE controller
* Go to the [*hci.js*](https://github.com/Skiti/BreakMi/blob/main/breakmi-ble/bleno/lib/hci-socket/hci.js) file
* Edit line 291, from `cmd.writeUInt8(0x00, 9);` to `cmd.writeUInt8(0x01, 9);`
* Edit line 292, from `cmd.writeUInt8(0x00, 10);` to `cmd.writeUInt8(0x01, 10);`

Video demonstration of the BLE Address Spoofing on Fitbit Charge 2:

[![demo6](http://img.youtube.com/vi/_f5I8_xmTzs/0.jpg)](https://youtu.be/_f5I8_xmTzs)

With this setup, BreakMi will be able to perform BLE address spoofing on Fitbit trackers. The changes on the BLE controller can be reverted by restarting the controller, or the machine. The changes on [*hci.js*](https://github.com/Skiti/BreakMi/blob/main/breakmi-ble/bleno/lib/hci-socket/hci.js) have to be manually reverted by editing the two aforementioned lines of code. Attacks on Xiaomi tracker will *NOT* work using Fitbit settings, and viceversa. If the error "Command Disallowed" appears, try running `advertising on` and then `advertising off` to fix it.

### Fitbit Peripheral (Tracker) Impersonation Attack

Instructions for Fitbit Peripheral Impersonation:
* The Fitbit peripheral (tracker) is currently not connected to the Fitbit app
* The attacker's machine is near both the peripheral and the mobile phone (running the companion app)
* Run `sudo systemctl stop bluetooth`, and then `sudo hciconfig hciN up` where N is the interface with the BLE spoofed address (otherwise the attack might fail because of how Bleno and Noble work)
* Follow the instructions described in the *Fitbit-specific Setup* section to perform BLE address spoofing for Fitbit
* Run `sudo BLENO_HCI_DEVICE_ID=N node breakmi.js`, select Peripheral Impersonation (option 1), and then the target Fitbit device model
* The machine will become a BLE peripheral
* Open the legitimate app that should automatically connect to the spoofed peripheral, instead of the legitimate one (stronger BLE signal)
* Fitbit peripheral logic is currently a work-in-progress

Video demonstration of the Peripheral Impersonation on Fitbit Charge 2:

[![demo7](http://img.youtube.com/vi/-EzbmsfTOSU/0.jpg)](https://youtu.be/-EzbmsfTOSU)

### Fitbit Central (App) Impersonation Attack

Instructions for Fitbit Central Impersonation:
* The Fitbit tracker is currently not connected to the Fitbit app (recommended to turn Bluetooth off on the mobile phone)
* The attacker's machine is near both the tracker and the mobile phone (running the companion app)
* Run `sudo systemctl stop bluetooth`, `sudo hciconfig hciM up` and `sudo hciconfig hciN up` (otherwise the attack might fail because of how Bleno and Noble work)
* Follow the instructions described in the *Fitbit-specific Setup* section to perform BLE address spoofing for Fitbit
* Run `sudo NOBLE_HCI_DEVICE_ID=M node breakmi.js`, select Central Impersonation (option 2), and then Central Side (option 1)
* Scan and connect to the legitimate peripheral
* Run `sudo BLENO_HCI_DEVICE_ID=N node breakmi.js`, select Central Impersonation (option 2), and then Peripheral Side (option 2)
* Open the companion app (enable Bluetooth on the mobile phone), and let the app connect to the spoofed peripheral
* Let the Authentication protocol run, afterwards the spoofed peripheral can be turned off
* Select Notify Info (option 1), walk while wearing the tracker and uncencrypted Live Data info notification will appear (e.g., the fifth byte is the step count in hex format)

Video demonstration of the App Impersonation on Fitbit app and Fitbit Charge 2:

[![demo8](http://img.youtube.com/vi/pYcxr5NyOSI/0.jpg)](https://youtu.be/pYcxr5NyOSI)

### Fitbit Man-in-the-Middle Attack

Instructions for Fitbit Man-in-the-Middle:
* The tracker is currently not connected to the app (recommended to turn Bluetooth off on the mobile phone)
* The attacker's machine is near both the tracker and the mobile phone (running the companion app)
* Use `bdaddr` to spoof the machine BLE address
* Run `sudo systemctl stop bluetooth`, `sudo hciconfig hciM up` and `sudo hciconfig hciN up` (otherwise the attack might fail because of how Bleno and Noble work)
* Run `sudo NOBLE_HCI_DEVICE_ID=M node breakmi.js`, select Man-in-the-Middle (option 3), and then Central Side (option 1)
* Scan and connect to the legitimate peripheral
* Run `sudo BLENO_HCI_DEVICE_ID=N node breakmi.js`, select Man-in-the-Middle (option 3), and then Peripheral Side (option 2)
* Open the companion app (enable Bluetooth on the mobile phone), and let the app connect to the spoofed peripheral
* Let the Authentication protocol run
* The attacker has a Man-in-the-Middle position
* Fitbit mitm logic is currently a work-in-progress