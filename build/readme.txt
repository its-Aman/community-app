release keystore password: password@123

follow below link
https://ionicframework.com/docs/v1/guide/publishing.html

1.
PATH: "C:\Program Files\Java\jdk1.8.0_51\bin"
COMMAND: .\jarsigner.exe -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "I:\Coding\ionic\CommunityEvent\build\my-release-key.keystore" "I:\Coding\ionic\CommunityEvent\build\app-release-unsigned.apk" communityEvent

SINGLE COMMAND:
cd "C:\Program Files\Java\jdk1.8.0_51\bin"; .\jarsigner.exe -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "I:\Coding\ionic\CommunityEvent\build\my-release-key.keystore" "I:\Coding\ionic\CommunityEvent\build\app-release-unsigned.apk" communityEvent

2.
PATH: "E:\Android_SDK\build-tools\25.0.0"
COMMAND: .\zipalign.exe -v 4 "I:\Coding\ionic\CommunityEvent\build\app-release-unsigned.apk" "I:\Coding\ionic\CommunityEvent\build\app-release.apk"

SINGLE COMMAND: 
cd "E:\Android_SDK\build-tools\25.0.0"; .\zipalign.exe -v 4 "I:\Coding\ionic\CommunityEvent\build\app-release-unsigned.apk" "I:\Coding\ionic\CommunityEvent\build\app-release.apk"

3.
SINGLE COMMAND back to project
cd "I:\Coding\ionic\CommunityEvent"


========================================= Debud keystore details =========================================

PS C:\Users\Aman Kumar\.android> keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
Alias name: androiddebugkey
Creation date: Nov 9, 2015
Entry type: PrivateKeyEntry
Certificate chain length: 1
Certificate[1]:
Owner: CN=Android Debug, O=Android, C=US
Issuer: CN=Android Debug, O=Android, C=US
Serial number: 2b091c22
Valid from: Mon Nov 09 17:19:14 IST 2015 until: Wed Nov 01 17:19:14 IST 2045
Certificate fingerprints:
         MD5:  6B:D3:5B:C2:1F:D1:97:AE:F0:5F:A5:CF:7A:6D:35:3B
         SHA1: B1:74:9A:19:73:8A:FD:4A:52:D0:68:B0:26:A9:F6:70:F7:6A:60:DE
         SHA256: B5:D9:2D:32:75:15:BC:A5:29:A2:90:E3:02:36:27:02:9D:04:4D:BC:9A:02:24:47:C6:3A:B3:A3:FA:FC:5B:19
Signature algorithm name: SHA256withRSA
Subject Public Key Algorithm: 2048-bit RSA key
Version: 3

Extensions:

#1: ObjectId: 2.5.29.14 Criticality=false
SubjectKeyIdentifier [
KeyIdentifier [
0000: 7C E8 86 ED 47 F4 00 ED   E6 3E 21 0C B5 8C E9 B4  ....G....>!.....
0010: 2A 5F CE F5                                        *_..
]
]



Warning:
The JKS keystore uses a proprietary format. It is recommended to migrate to PKCS12 which is an industry standard format using "keytool -importkeystore -srckeystore debug.keystore -destkeystore debug.keystore -deststoretype
pkcs12".



========================================= Release keystore details =========================================

SHA1: 6A:77:1C:3A:8A:A2:C3:98:67:78:5D:77:78:59:42:A0:7C:39:97:AD
