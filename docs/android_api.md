# <span style="color: rgb(240,95,34)">1.1. Introduction</span>
SensemoreApi is a library that helps developers to integrate their android applications to Sensemore productions."Sensemore Infinity" is the main product right now. 
You can easily scan/connect/measure SensemoreInfinity via using this library. If you want to have the library please contact hello@sensemore.io. 

You can also skip the reading part and check out example application to understand fundamental usages of this api.

## <span style="color: rgb(240,95,34)">1.2. Getting Started</span>

### <span style="color: rgb(240,95,34)">1.2.1. Requirements</span>
Make sure you are including these libraries to your app.gradle
Dependencies:

SensemoreApi uses reactivex modules to manage async operations 
 **API level must be greater than 24**
```gradle
implementation 'io.reactivex.rxjava2:rxandroid:2.1.1' //manage asyn operations
implementation "com.polidea.rxandroidble2:rxandroidble:1.11.0" //reactive BLE dependency
implementation group: 'com.fasterxml.jackson.dataformat', name: 'jackson-dataformat-csv', version: '2.9.8'//JSON parse, export
implementation 'net.sf.opencsv:opencsv:2.3'//csv export
```

### <span style="color: rgb(240,95,34)">1.2.2. Installing the api</span>
SensemoreaApi will be handed as .aar file and for the same reason, you should define above dependencies in order to keep the library size and management clean. 
You should import .aar file to your project from **File > New > New Module, click "Import .JAR/.AAR Package"** module type then choose the path of library file.

Sync your project and build. Lastly, define the dependency in your app.gradle 

```gradle
implementation project(":sensemoreapi")
```

### <span style="color: rgb(240,95,34)">1.2.3. Permissions</span>
Since the sensemoreApi uses BLE you should request permissions to access Bluetooth and Locations services.

_AndroidManifest.xml_
```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```
Requesting permissions
```java
requestPermissions(new String[]{ Manifest.permission.BLUETOOTH, Manifest.permission.ACCESS_FINE_LOCATION}, PERMISSIONS);
```

# <span style="color: rgb(240,95,34)">2. Usage</span>

Build your api instance as
```api = SensemoreApi.Build(this);``` then you are ready to go. Almost all api methods use reactive consumers to handle situations.

### <span style="color: rgb(240,95,34)">2.0.1. Scan</span>
Scan method is making BLE scans with name filter of Sensemore products names so you can only connect to Sensemore products. Scan will be destroyed after connection state changes.
```java
 api.Search(scanResult -> {
            Log("Scan result " + scanResult.DeviceName + ", mac:" + scanResult.MacAddress + ", rssi:" + scanResult.Rssi);
        }, throwable -> {
            Log("Error scan", throwable);
        });
```

### <span style="color: rgb(240,95,34)">2.0.2. Connect/Disconnect</span>
Connect requires valid macaddress and state callback as parameter. Invalid mac addresses will break the application. 
In order to disconnect from device, you just need to call ```api.Disconnect()``` method. 'onDisconnect and onDisconnected' events will be consumed.

```java
 api.Connect(macAddress.getText().toString(), connectCallbacks);
 
  ConnectCallbacks connectCallbacks = new ConnectCallbacks() {
        @Override
        public void onConnecting() {
            Log.i("ON_CONNET", "Connecting");
        }

        @Override
        public void onConnected() {
            Log("onConnected");
        }

        @Override
        public void onDisconnected() {
            Log("onDisconnected");
        }

        @Override
        public void onDisconnecting() {
            Log("onDisconnecting");
        }

        @Override
        public void onError(Throwable throwable) {
            Log("error connection", throwable);
        }
    };
```
### <span style="color: rgb(240,95,34)">2.0.3. Read Device Stats</span>
Device stats hold four types of information 
- Temperature, inner temperature of device
- Battery, remaining battery voltage
- Calibrated sampling rate, a sampling rate calculated in last measurement operation
- Rssi, bluetooth connectivity metric

```java
 api.ReadDeviceStats(deviceStats -> {
                    Log("Device stats, Temperature:" + deviceStats.temperature + ", battery" + deviceStats.battery + ", Calibrated Sampling rate:" + deviceStats.calibratedSamplingRate + ", Rssi:" + deviceStats.rssi);
                },
                throwable -> {
                    Log("Error device stats", throwable);
                });
```
## <span style="color: rgb(240,95,34)">2.1. Measurement</span>
There are two types of measurement, Batch and Stream

Batch measurement sends measurement command to the device and reads measurement data after successfully completed.

Stream measurement immediately streams measurement chunks to the callback, Stream measurement is only performed  by profiles with SamplingRate 800Hz and below.

### <span style="color: rgb(240,95,34)">2.1.1. Tag</span>
You could want to track your measurements by some reference. Use tags as your reference.

### <span style="color: rgb(240,95,34)">2.1.2. Profile</span>

Properties:

| WARNING: You should be e careful while setting the SampleSize and SamplingRate. The relation of them will determine the measurement time (sampleSize/samplingRate). If   samplesize is too big you could cause a very long measurement and it will consume device's battery drastically |

- Name
    - Profile holds information related to measurement configurations. You could give a name and store for further usage.
- SampleSize
  - Defines how many samples will be retrieved for sum of all axes after successful measurement. 
- SamplingRate
- AccelerometerRange
  - Defines the sensitivity of accelerometer sensor.  
- SensorSelection
  - SensemoreInfinity only has Accelerometer for signal measurement. It is defined for further usage

Do not create profile parameters from default constructor you can use predefined instances as below
```java
String name = "Example Profile";
int sampleSize = 10000;
SamplingRate samplingRate = SamplingRate.Rate800Hz;
SensorSelection sensorSelection = SensorSelection.Accelerometer;
Accelerometer accelerometerRange = Accelerometer.Range2G;

Profile profile= new Profile(name, sampleSize, samplingRate, accelerometerRange, sensorSelection);
```
### <span style="color: rgb(240,95,34)">2.1.3. BatchMeasurement</span>
Profile needs to be given in order to take batch measurement.
After defining a profile you just need to pass the profile and tags to the BatchMeasure method
```java
  api.BatchMeasurement(profile, tags, () -> {
                    Log("Data reading started");
                },
                measurement -> {
                    Log("Measurement Done Reading");
                    // it is good time to read device stats

                },
                throwable -> {
                    Log("Error", throwable);
                });
```
You do not have to calibrate sensemore devices. Sensemore devices calculate calibrated sampling rates on the fly while measuring. After successful measurement you can read calibrated sampling rate from [ReadDeviceStats](#read-device-stats) mehtod



### <span style="color: rgb(240,95,34)">2.1.4. Stream Measurement</span>
Profile needs to be given in order to take batch measurement.
After definig a profile just need to pass profile and tags to the BatchMeasure method

| WARNING: Do not forget to stop stream measurement when you don't need it. There is no timeout control that stops communications. |
```java
  api.StreamMeasurement(profile, tags, streamChunk -> {
                    Log(streamChunk.accelerometerX +
                     "," + streamChunk.accelerometerY +
                      "," + streamChunk.accelerometerZ);
                },
                throwable -> Log("Stream error", throwable));
```
Stop:
```java
 api.StopStream(measurement -> {
     //measurement hold cumulative measurement data.
});
```

## <span style="color: rgb(240,95,34)">2.2. Utils</span>

### <span style="color: rgb(240,95,34)">2.2.1. Parser</span>
Parser methods listed below
- `measurement.ToJSON()`
- `measurement.ParseJSON()`
- `measurment.ConvertToCSV()`





