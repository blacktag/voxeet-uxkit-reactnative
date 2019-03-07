
# react-native-voxeet-conferencekit

## Getting started

`$ npm install @voxeet/react-native-voxeet-conferencekit --save`

### Mostly automatic installation

`$ react-native link @voxeet/react-native-voxeet-conferencekit`

**_Note: For Android, you need to update the do the Mandatory Modification_**

### Manual installation


#### iOS

1. Open your Xcode project from YOUR_PROJECT/ios/YOUR_PROJECT.xcworkspace (or .xcodeproj if there is no .xcworkspace)

2. Go to your target settings -> 'Capabilities' -> 'Background Modes': enable **background mode**
- Turn on 'Audio, AirPlay and Picture in Picture'  
- Turn on 'Voice over IP'

If you want to support CallKit (receiving incoming call when application is killed) with VoIP push notification, enable 'Push Notifications' (you will need to upload your [VoIP push certificate](https://developer.apple.com/account/ios/certificate/) to the Voxeet developer portal).

3. Privacy **permissions**, add two new keys in the Info.plist:
- Privacy - Microphone Usage Description
- Privacy - Camera Usage Description

4. Open a Finder and go to YOUR_PROJECT/node_modules/@voxeet/react-native-voxeet-conferencekit/ios/Carthage/Build/iOS, drag and drop `VoxeetSDK.framework`, `WebRTC.framework`, `VoxeetConferenceKit.framework` and `Kingfisher.framework` into the **Frameworks** folder from Xcode project (deselect `Copy items if needed` and select your target(s))

5. Go to your target settings -> 'Build Phases': Add a **New Run Script Phase**

```bash
/usr/local/bin/carthage copy-frameworks
```

Input files:
- `$(PROJECT_DIR)/../node_modules/@voxeet/react-native-voxeet-conferencekit/ios/Carthage/Build/iOS/Kingfisher.framework`
- `$(PROJECT_DIR)/../node_modules/@voxeet/react-native-voxeet-conferencekit/ios/Carthage/Build/iOS/VoxeetSDK.framework`
- `$(PROJECT_DIR)/../node_modules/@voxeet/react-native-voxeet-conferencekit/ios/Carthage/Build/iOS/WebRTC.framework`
- `$(PROJECT_DIR)/../node_modules/@voxeet/react-native-voxeet-conferencekit/ios/Carthage/Build/iOS/VoxeetConferenceKit.framework`

6. Go to your target settings -> 'Build Settings' in `All` (the default view is in `Basic` mode):
- **FRAMEWORK_SEARCH_PATHS** = $(PROJECT_DIR)/../node_modules/@voxeet/react-native-voxeet-conferencekit/ios/Carthage/Build/iOS
- **ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES** = YES

7. If you are using **ExpoKit** there is an extra step (https://docs.expo.io/versions/latest/expokit/expokit#ios):
Select RNVoxeetConferencekit.xcodeproj and go to the target settings -> 'Build Settings':
- **HEADER_SEARCH_PATHS** = $(PROJECT_DIR)/../../../../ios/Pods/Headers/Public (in `recursive`)

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNReactNativeVoxeetConferencekitPackage;` to the imports at the top of the file
  - Add `voxeet` to the list returned by the `getPackages()` method
  - Add a field in the `MainApplication` class named voxeet : `private RNReactNativeVoxeetConferencekitPackage voxeet;`
  - in the `onCreate` method, instantiate the `voxeet` field to a new instance of the `RNReactNativeVoxeetConferencekitPackage` class : `voxeet = new RNReactNativeVoxeetConferencekitPackage(MainApplication.this);`

2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':@voxeet_react-native-voxeet-conferencekit'
  	project(':@voxeet_react-native-voxeet-conferencekit').projectDir = new File(rootProject.projectDir, 	'../node_modules/@voxeet/react-native-voxeet-conferencekit/android')
  	```

3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile (project(':@voxeet_react-native-voxeet-conferencekit')) {
          transitive = true
      }
  	```
### Mandatory modification

**Warning : those modification are not done automatically by `react-native link`. You must set them !**

#### Android

You must edit those files :
- `build.gradle`
- `app/build.gradle`
- `app/src/main/AndroidManifest.xml`
- `MainActivity`
- `MainApplication`

##### build.gradle

At the end of the file, add this structure declaration :
```
ext {
    buildToolsVersion = "28.0.3"
    minSdkVersion = 16
    compileSdkVersion = 28
    targetSdkVersion = 27
    supportLibVersion = "28.0.0"
    voxeetSdkVersion = "1.4.12"
    mediaSdkVersion = "0.8.2"
}
```

##### app/build.gradle

The SDK currently uses the 28.0.0 support libraries, you must add dependencies to those versions to prevent conflict with other non updated libraries

Modify your app/build.gradle to add
```
    implementation "com.android.support:supportt-compat:${rootProject.ext.supportLibVersion}"
    implementation "com.android.support:appcompat-v7:${rootProject.ext.supportLibVersion}"
    implementation "com.android.support:recyclerview-v7:${rootProject.ext.supportLibVersion}"

    //possibly this one too
    implementation "com.android.support:design:${rootProject.ext.supportLibVersion}"
```

Note that the following list is not limited to those but since the first 3 ones are directly dependance of the library, it's a best practice to use them.

In case of library incompatibilities, you can also fork them, update them and report the use of the `rootProject.ext.someField` usage as describe in the Android Developer documentation.


VoxeetSDK uses Java 8 instructions. Please edit the app/build.gradle to incorporate this compilation mode :

```
android {
    ...

    compileOptions {
        sourceCompatibility 1.8
        targetCompatibility 1.8
    }

    ...
}
```

##### MainApplication

Follow the implementation from the `link` documentation, first step


##### MainActivity

- if your `MainActivity` extends `ReactActivity`, change `MainActivity extends ReactActivity` to `MainActivity extends RNVoxeetActivity`

with the following import :
`import com.voxeet.specifics.RNVoxeetActivity`

- if you are using `Expo` or you do the above modification
Using Android Studio, copy paste the following method calls in the `MainActivity.java` file :
* In the imports :
```
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
```

* In the code :
```
  private RNVoxeetActivityObject mActivityObject;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);

      mActivityObject = new RNVoxeetActivityObject();
      mActivityObject.onCreate(this);
  }

  @Override
  protected void onResume() {
      super.onResume();

      mActivityObject.onResume(this);
  }

  @Override
  protected void onPause() {
      mActivityObject.onPause(this);

      super.onPause();
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
      super.onRequestPermissionsResult(requestCode, permissions, grantResults);

      mActivityObject.onRequestPermissionsResult(requestCode, permissions, grantResults);
  }

  @Override
  public void onNewIntent(Intent intent) {
      super.onNewIntent(intent);

      mActivityObject.onNewIntent(intent);
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
      if (!mActivityObject.onActivityResult(requestCode, resultCode, data)) {
          super.onActivityResult(requestCode, resultCode, data);
      }
  }
```

#### app/src/main/AndroidManifest.xml

After the `permissions` required, add those xml nodes :

```
  <!-- VOXEET PERMISSION - WARNING : THERE MAY BE DUPLICATES - no expected issues -->

  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>

  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  <uses-permission android:name="android.permission.WAKE_LOCK" />
  <uses-permission android:name="android.permission.BLUETOOTH" />
  <uses-permission android:name="android.permission.RECORD_AUDIO" />
  <uses-permission android:name="android.permission.INTERACT_ACROSS_USERS_FULL" />
  <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.READ_PHONE_STATE" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.CAMERA" />
```


## Usage
```javascript
import { VoxeetSDK, ConferenceUser } from "@voxeet/react-native-voxeet-conferencekit";
...
```

## Configuration

Depending on your Environment, you must configurate your project according to the public documentation

### iOS

Please go to [iOS Conferencekit](https://github.com/voxeet/voxeet-ios-conferencekit)

### Android

Please go to [Android SDK Sample](https://github.com/voxeet/android-sdk-sample)

## License

```
   Copyright 2019 - Voxeet

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
```
