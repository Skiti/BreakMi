# Frida Hooks

## Prerequisites

* Mobile phone running Android
* Root access to run Frida on the phone
* Installation of Frida on the phone and the attacking machine
* Installation of Zepp Life or Zepp companion app
* Fitness tracker compatible with the attacks as a BLE peripheral (e.g., Mi Band 2, Mi Band 3, Amazfit Band 2, Mi Band 4, Mi Band 5, Fitbit Charge 2)
* Legitimate pairing between the peripheral and the companion app

## Hooking Companion Apps

Zepp Life and Zepp utilize the same proprietary APIs, but their names slightly change (due to code obfuscation in Zepp Life). Thus, each app has it's own hooking file.
How to run the Frida hooks:
* Edit [breakmi-hooks.py](https://github.com/Skiti/BreakMi/blob/main/frida-hooks/breakmi-hooks.js) according to the target companion app
  - Zepp Life: `device.spawn(["com.xiaomi.hm.health"])` and `open("zepplife-breakmi-hooks.js")`
  - Zepp: `device.spawn(["com.huami.watch.hmwatchmanager"])` and `open("zepp-breakmi-hooks.js")`
* Run `python breakmi-hooks.py`
* Utilize the app and the tracker (e.g., pair/unpair a tracker, synchronize data)

## Hooks Categories

### Web API Hooks

These hooks intercept interesting values send to and received from Huami backend. The script only hooks a few values, but there are several more that can be added. In particular, the hooks show how, during Pairing v2, the app sends *SHA1(pub k)* and *B64(Key)* in order to retrieve *Signature* from the backend.

### BLE Hooks

These hooks intercept interesting values related to BLE traffic. In particular, the hooks show how, during Authentication, the app generates the challenge by calculating *Resp* = AES(*Chal*,*Key*).
