# bleSourceRef
Reference app for ble communication:

 - scan for ble devices
 - connect to ble devices
 - send and receive data from ble devices

**Currently only tested on Android.**

## Steps to test the code (ble only works on a physical phone):
 1. Enable developer options on the mobile phone and turn on USB degugging
 2. Connect the phone to the computer
 3. Open two terminals on the source code folder
 4. On the first terminal run the command: "react-native start"
 5. While it's runinng, on the second terminal run the command: "react-native run-android"
 6. The app should now run on the mobile device (given that the android studio is setup properly)