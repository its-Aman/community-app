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
