# objection --gadget "com.huami.watch.hmwatchmanager" explore
# objection --gadget "com.xiaomi.hm.health" explore

import frida, sys

device = frida.get_usb_device()
# Zepp Life: com.xiaomi.hm.health
# Zepp: com.huami.watch.hmwatchmanager
pid = device.spawn(["com.xiaomi.hm.health"])
session = device.attach(pid)
# Zepp Life: zepplife-breakmi-hooks.js
# Zepp: zepp-breakmi-hooks.js
with open("zepplife-breakmi-hooks.js") as f:
    script = session.create_script(f.read())
script.load()
device.resume(pid)
sys.stdin.read()