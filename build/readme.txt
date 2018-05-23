release keystore password: password@123

follow below link
https://ionicframework.com/docs/v1/guide/publishing.html

1.
.\jarsigner.exe -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "I:\Coding\ionic\
CommunityEvent\build\my-release-key.keystore" "I:\Coding\ionic\CommunityEvent\build\app-release-unsigned.apk" CommunityApp

2.
.\zipalign.exe -v 4 "I:\Coding\ionic\CommunityEvent\build\app-release-unsigned.apk" "I:\
Coding\ionic\CommunityEvent\build\app-release.apk"

3.
