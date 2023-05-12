<h1>Wired PRO </h1>
<img src="images/WiredPro.gif"/>
<p style="width:50%">
The Wired PRO device is a sophisticated iteration of its predecessor, the wired device. It is a fusion of an Internet of Things (IoT) device and a sensor, offering the convenience of direct WIFI network connectivity and MQTT-based communication. Wired PRO features advanced measurement configurations, rendering it suitable for complex use cases. Its hardware includes an accelerometer and magnetometer, which can conduct simultaneous measurements with raw signal data. These configurations enable the analysis of magnetic field variations, facilitating predictions of rotation speed and other related parameters. 
</p>

- [Wired PRO MQTT Integration](#wired-pro-mqtt-integration)
	- [Accessing Web Configuration Page](#accessing-web-configuration-page)
	- [MQTT Broker and Certificates](#mqtt-broker-and-certificates)
	- [NTP](#ntp)
	- [Operations](#operations)
		- [Scan](#scan)
		- [Requesting Senseway Version](#requesting-senseway-version)
		- [Requesting Version for Endnode](#requesting-version-for-endnode)
	- [Measurement and Configuration](#measurement-and-configuration)
	- [Measurement Modes](#measurement-modes)
		- [Immediate Measurement](#immediate-measurement)
		- [Continuous Measurement](#continuous-measurement)
		- [Periodic Measurement](#periodic-measurement)
	- [Topics](#topics)
		- [Config Schema](#config-schema)
		- [Measurement Topics](#measurement-topics)
		- [Chunk ordering and interpretation](#chunk-ordering-and-interpretation)
	- [Post Processing](#post-processing)
		- [Example](#example)
		- [If sensor type is =1 (Accelerometer)](#if-sensor-type-is-1-accelerometer)
		- [If sensor type is =2 (Magnetometer)](#if-sensor-type-is-2-magnetometer)
		- [If sensor type is =3 (Accelerometer|Magnetometer)](#if-sensor-type-is-3-accelerometermagnetometer)
		- [Accelerometer Range Correction](#accelerometer-range-correction)
	- [Device Firmware Update(OTA)](#device-firmware-updateota)
	- [TLS](#tls)
		- [Mosquitto Configuration](#mosquitto-configuration)
		- [Certificate Generation](#certificate-generation)
			- [CA Generation](#ca-generation)
			- [Server Certificate Generation](#server-certificate-generation)
			- [Client Certificate Generation](#client-certificate-generation)
	- [Tips](#tips)

# Wired PRO MQTT Integration

<img width="50" style="line-height:10px" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"></img> Example Python Project can be found at [Sensemore Python Mqtt Integration](https://github.com/sensemore/sensemore-python-mqtt-client)

## Accessing Web Configuration Page

Shortly after the Senseway is plugged in, it opens a wifi acces point network with **Senseway-CA&colon;B8&colon;XX&colon;XX&colon;XX&colon;XX** SSID'. Use default password to connect AP network, Open your browser and navigate to adress [http:\\\\192.168.4.1 ](http:\192.168.4.1)

## MQTT Broker and Certificates

Senseway needs MQTT / TLS configuration. The MQTT Broker Server to be used must support TLS and have the required certificates for the senseway.

-   MQTT endpoint (_mqtts: //my-mqtt-broker.server: 8883_)
-   CA (CA certificate)
-   Client Cert (a created and signed certificate from CA)
-   Client Key (private key of the certificate generated through the CA)

Required certificates and endpoint information are defined in 'Advance> MQTT' via the Senseway configuration page. Senseway uses these certificates for the future MQTT connections.

Details
https://www.hivemq.com/blog/mqtt-security-fundamentals-tls-ssl/

## NTP

_Default: http://pool.ntp.org/_
Time information is also used in the measurement messages sent by Senseway. Time synchronization is needed for this. For OnPremise installations, the time server can be defined from `Advance > NTP`.

## Operations

It explains which topics to use when communicating with Senseway and how messages should be interpreted.

`Actor` sends `Payload` with `PayloadType` format to `Topic`

### Scan

Senseway periodically initiates a scan for connected devices. Scan results are published periodically on MQTT. (~ 1min)

<table>
<tr>
<th>Actor</th>
<th>Topic</th>
<th>Payload Type</th>
<th>Payload Schema</th>
<th>Example</th>
</tr>
<tr>
<td>
Senseway
</td>

<td><b>lake/gateway/&lt;DeviceMac&gt;/scanDevice</b></td>

<td>json</td>
<td>

```json
{
	"<DEVICE-MAC>": {
		"type": "<DEVICE_TYPE>",
		"rssi": "<RSSI>",
		"status": "<STATUS>"
	},
	"<DEVICE-MAC2>": {
		"type": "<DEVICE_TYPE>",
		"rssi": "<RSSI>",
		"status": "<STATUS>"
	}
}
```

</td>
<td>

```json
{
	"CA:B8:31:00:00:1A":{
	"type":"WIRED",
	"rssi":"-19",
	"status":"Ready"
	},
	{
	"CA:B8:31:00:00:20":{
	"type":"WIRED",
	"rssi":"-19",
	"status":"Measuring"
	},
}
```

</td>
</tr>
</table>

### Requesting Senseway Version

<table>
<tr>
<th>Actor</th>
<th>Topic</th>
<th>Payload Type</th>
<th>Payload Schema</th>
<th>Example</th>
</tr>
<tr>
<td>
User
</td>
<td>
<b> lake/gateway/&lt;DeviceMac&gt;/client/SENSEWAY/version</b>
</td>
<td>
text
</td>
<td>
<i>empty text</i>
</td>
<td>
<i></i>
</td>
</tr>
<tr>
	<td>
	Senseway
	</td>
	<td>
	<b> lake/gateway/&lt;DeviceMac&gt;/client/SENSEWAY/version/accepted</b>
	</td>
	<td>
	text
	</td>
	<td>
	<i>version text</i>
	</td>
	<td>
	1.1.0
	</td>
</tr>
</table>

### Requesting Version for Endnode

<table>
<tr>
<th>Actor</th>
<th>Topic</th>
<th>Payload Type</th>
<th>Payload Schema</th>
<th>Example</th>
</tr>
<tr>
<td>
User
</td>
<td>
<b> lake/gateway/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt/version</b>
</td>
<td>
text
</td>
<td>
<i>empty text</i>
</td>
<td>
<i></i>
</td>
</tr>
<tr>
	<td>
	Senseway
	</td>
	<td>
	<b> lake/gateway/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt/version/accepted</b>
	</td>
	<td>
	text
	</td>
	<td>
	<i>version text</i>
	</td>
	<td>
	1.1.0
	</td>
</tr>
<tr>
	<td>
	Senseway
	</td>
	<td>
	<b> lake/gateway/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt/version/rejected</b>
	</td>
	<td>
	text
	</td>
	<td>
	<i>error message</i>
	</td>
	<td>
	NO_DEVICE
	</td>
</tr>
</table>

## Measurement and Configuration

The measurement process starts with sending a configuration to the end device, then the measurement reading process begins. Measurement reading process is done with chunks. The subscriber user is required to interpret and parse the measurement reading packets in the correct order.

## Measurement Modes

The Wired PRO device has three measurement modes: immediate, continuous, and periodic.

### Immediate Measurement

Immediate measurement is for measurements that you take whenever you want from the device. An external measure message will be sent to the device. The device uses immediate measurement configuration to perform the measurement.

### Continuous Measurement

When continuous measurement is enabled, the device performs a measurement non-stop with certain time windows according to the given configuration. The device calculates GRMS and VRMS values and compares them with the previous calculations. If the difference of these values exceeds the given threshold values, the device alarms the system to publish recorded measurement to the MQTT. Even if there is no change for a certain period of time, the device will publish the measurement.

### Periodic Measurement

Periodic measurement is enabled when a fixed interval is set for taking measurements. The device takes measurements according to the given configuration and publishes them to the MQTT.

## Topics

<table>
<tr>
<th>Actor</th>
<th>Topic</th>
<th>Payload Type</th>
<th>Payload Schema</th>
<th>Example</th>
</tr>
<tr>
<td>
User
</td>
<td>
<b> lake/gateway/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt/config</b>
</td>
<td>
text
</td>
<td>
<i>empty text</i>
</td>
<td>
<i></i>
</td>
</tr>
<tr>
	<td>
	Device
	</td>
	<td>
	<b> lake/gateway/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt/version/accepted</b>
	</td>
	<td>
	text
	</td>
	<td>
	<i>{JSON config payload}</i>
	</td>
<td>	
<pre>
{
  "periodic_measurement_sample_size": 1000,
  "periodic_measurement_frequency": 3200,
  "periodic_measurement_accelerometer_range": 16,
  "periodic_measurement_period_secs": 900,
  "periodic_measurement_enabled": false,
  "periodic_measurement_sensor_type": 1,
  "continuous_measurement_window_sample_size": 3200,
  "continuous_measurement_frequency": 1600,
  "continuous_measurement_accelerometer_range": 16,
  "continuous_measurement_enabled": true,
  "continuous_measurement_period_secs": 600,
  "immediate_measurement_sample_size": 1000,
  "immediate_measurement_frequency": 6400,
  "immediate_measurement_accelerometer_range": 8,
  "immediate_measurement_sensor_type": 1,
  "grms_threshold": 0.1,
  "vrms_threshold": 0.1
}
</pre>
</td>
</tr>
<tr>
	<td>
	DEvice
	</td>
	<td>
	<b> lake/gateway/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt/config/rejected</b>
	</td>
	<td>
	text
	</td>
	<td>
	<i>error message</i>
	</td>
	<td>
	INVALIG_ARG
	</td>
</tr>
</table>

### Config Schema

<table><thead><tr><th>Configuration</th><th>Valid Values</th><th>Example Value</th></tr></thead><tbody><tr><td>periodic_measurement_sample_size</td><td>Any positive from  100  up to 100000</td><td>1000</td></tr><tr><td>periodic_measurement_frequency</td><td>3200, 6400, 12800, 25600</td><td>3200</td></tr><tr><td>periodic_measurement_accelerometer_range</td><td>2, 4, 8, 16</td><td>16</td></tr><tr><td>periodic_measurement_period_secs</td><td>Any positive integer from 600 to 43200</td><td>900</td></tr><tr><td>periodic_measurement_enabled</td><td>true, false</td><td>false</td></tr><tr><td>periodic_measurement_sensor_type</td><td>1, 2, 3</td><td>1</td></tr><tr><td>continuous_measurement_window_sample_size</td><td>Any positive integer, from 100 up to 6400</td><td>3200</td></tr><tr><td>continuous_measurement_frequency</td><td>1600, 3200, 6400, 12800, 25600</td><td>1600</td></tr><tr><td>continuous_measurement_accelerometer_range</td><td>2, 4, 8, 16</td><td>16</td></tr><tr><td>continuous_measurement_enabled</td><td>true, false</td><td>true</td></tr><tr><td>continuous_measurement_period_secs</td><td>Any positive integer from 600 to 43200</td><td>600</td></tr><tr><td>immediate_measurement_sample_size</td><td>Any positive integer, from 100 up to 100000</td><td>1000</td></tr><tr><td>immediate_measurement_frequency</td><td>1600, 3200, 6400, 12800, 25600</td><td>6400</td></tr><tr><td>immediate_measurement_accelerometer_range</td><td>2, 4, 8, 16</td><td>8</td></tr><tr><td>immediate_measurement_sensor_type</td><td>1, 2, 3</td><td>1</td></tr><tr><td>grms_threshold</td><td>Any positive number</td><td>0.10000000149011612</td></tr><tr><td>vrms_threshold</td><td>Any positive number</td><td>0.10000000149011612</td></tr></tbody></table>

Here is an example JSON payload for config

### Measurement Topics

If continious or periodic measurement is enabled, device can publish a measurement meassage by their own. For this cases, an external system/consumer or service is responsible for handling the measurement and merge chunk values.

</table>

<table>
<tr>
<th>Actor</th>
<th>Topic</th>
<th>Payload Type</th>
<th>Payload Schema</th>
<th>Example</th>
</tr>
<tr>
<td>
User
</td>
<td>
<b> lake/gateway/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt;/measure/&lt;objectId&gt;</b>
</td>
<td>
text
</td>
<td>
<i>&lt;accelerometerRangeIndex&gt;,&lt;samplingRateIndex&gt;,&lt;sampleSize&gt;</i>
</td>
<td>
<i>1,5,10000</i>
</td>
</tr>
<tr>
	<td>
	Senseway
	</td>
	<td>
	<b>   lake/gateway/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt;/measure/&lt;objectId&gt;/accepted</b>
	</td>
	<td>
	text
	</td>
	<td>
	<i>empty text</i>
	</td>
	<td>
	</td>
</tr>
<tr>
	<td>
	Senseway
	</td>
	<td>
	<b> lake/gateway/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt;/measure/&lt;objectId&gt;/rejected</b>
	</td>
	<td>
	text
	</td>
	<td>
	<i>error message</i>
	</td>
	<td>
	NO_DEVICE
	</td>
</tr>
<tr>
	<td>
	Senseway
	</td>
	<td>
	<b> lake/device/&lt;DeviceMac&gt;/measure/&lt;objectId&gt;/chunk/&lt;chunkIndex&gt;</b>
	</td>
	<td>
	binary
	</td>
	<td>
	<i>Binary chunk message</i>
	</td>
	<td>
	a0 43 46 04 b7 fc f1 43 03 04 b1 fc 94 43 04 04
	</td>
</tr>
<tr>
<td>
Senseway
</td>
<td>
<b> lake/gateway/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt;/measure/&lt;objectId&gt;/done</b>
</td>
<td>
json
</td>
<td>

```json
{
	"STAT": {
		"MEASUREMENT_START_TIME": "<Hour: Minute: Second: Day: Month: Year>",
		"CALIBRATED_SAMPLINGRATE": "<calibratedSamplingRate>"
	},
	"TELEMETRY": [
		{
			"NAME": "<TELEMETRY>",
			"VALUE": "<VALUE>"
		}
	]
}
```

</td>
<td>

```json
{
	"STAT": {
		"MEASUREMENT_START_TIME": "12:28:07:12:05:2023",
		"MEASUREMENT_START_UNIXTIME": 1683894479,
		"CHUNK_COUNT": 150,
		"VERSION": "1.3.0",
		"DEVICE_TYPE": "WIRED",
		"MEASUREMENT_TYPE": "IMMEDIATE",
		"SENSOR_TYPE": 3,
		"ACCELEROMETER_SAMPLE_SIZE": 50000,
		"ACCELEROMETER_SAMPLINGRATE": 12800,
		"ACCELEROMETER_CALIBRATED_SAMPLINGRATE": 10278.6728515625,
		"ACCELEROMETER_RANGE": 8,
		"MAGNETOMETER_SAMPLE_SIZE": 1136,
		"MAGNETOMETER_CALIBRATED_SAMPLINGRATE": 233.60621643066406,
		"N_ACC_PER_READ": 44,
		"N_MAG_PER_READ": 1
	},
	"TELEMETRY": [{ "NAME": "TEMPERATURE", "VALUE": 36.329998016357422 }]
}
```

</td>
</tr>
</table>

### Chunk ordering and interpretation

The measurements are divided into chunks and sent binary, chunkIndex is an index that counts down to 0. For example, we wanted a measurement of 10000 samples. We would see the following messages on MQTT.

> lake/gateway/CA&colon;B8&colon;28&colon;00&colon;00&colon;08/device/CA&colon;B8&colon;31&colon;00&colon;00&colon;1A/measure/098765432109876543214321 <br>

> lake/gateway/CA&colon;B8&colon;28&colon;00&colon;00&colon;08/device/CA&colon;B8&colon;31&colon;00&colon;00&colon;1A/measure/098765432109876543214321/accepted<br>

> lake/device/CA&colon;B8&colon;31&colon;00&colon;00&colon;1A/measure/098765432109876543214321/chunk/2<br>
> a0 43 46 04 b7 fc f1 43 03 04 b1 fc 94 43 04 04

> lake/device/CA&colon;B8&colon;31&colon;00&colon;00&colon;1A/measure/098765432109876543214321/chunk/1<br>
> 21 04 99 fc f0 43 35 04 d5 fc a2 43 41 04 c6 fc

> lake/device/CA&colon;B8&colon;31&colon;00&colon;00&colon;1A/measure/098765432109876543214321/chunk/0<br>
> b1 fc a8 43 60 04 a8 fc a9 43 2c 04 c3 fc b2 43

> lake/gateway/CA&colon;B8&colon;28&colon;00&colon;00&colon;08/device/CA&colon;B8&colon;31&colon;00&colon;00&colon;1A/measure/098765432109876543214321/done<br>

```json
{
	"STAT": {
		"MEASUREMENT_START_TIME": "12:28:07:12:05:2023",
		"MEASUREMENT_START_UNIXTIME": 1683894479,
		"CHUNK_COUNT": 150,
		"VERSION": "1.3.0",
		"DEVICE_TYPE": "WIRED",
		"MEASUREMENT_TYPE": "IMMEDIATE",
		"SENSOR_TYPE": 3,
		"ACCELEROMETER_SAMPLE_SIZE": 50000,
		"ACCELEROMETER_SAMPLINGRATE": 12800,
		"ACCELEROMETER_CALIBRATED_SAMPLINGRATE": 10278.6728515625,
		"ACCELEROMETER_RANGE": 8,
		"MAGNETOMETER_SAMPLE_SIZE": 1136,
		"MAGNETOMETER_CALIBRATED_SAMPLINGRATE": 233.60621643066406,
		"N_ACC_PER_READ": 44,
		"N_MAG_PER_READ": 1
	},
	"TELEMETRY": [{ "NAME": "TEMPERATURE", "VALUE": 36.329998016357422 }]
}

```

## Post Processing

In the example above, there are 3 chunk in total, the chunk index value starts from 2 and counts to 0.
When all chunks are sent, we get the message / done with json payload. This gives us the information that chunks are ready to be interpreted.

### Example

Let's take a measurement of 8 samples with the 2G accelerometer range.
8 -> 8 _ 3 = 24 total samples
Each sample is represented by int16 -> 2 _ 24 -> 48 bytes

<table>
<tr>
<td>chunk2</td><td>a0 43 46 04 b7 fc f1 43	03 04 b1 fc 94 43 04 04</td>
</tr><tr>
<td>chunk1</td><td>21 04 99 fc f0 43 35 04	d5 fc a2 43 41 04 c6 fc</td></tr>
<tr>
<td>chunk0</td><td>b1 fc a8 43 60 04 a8 fc	a9 43 2c 04 c3 fc b2 43</td></tr>
<tr><td>Merged Bytes</td><td>b1 fc a8 43 60 04 a8 fc a9 43 2c 04 c3 fc b2 43
21 04 99 fc f0 43 35 04 d5 fc a2 43 41 04 c6 fc
a0 43 46 04 b7 fc f1 43 03 04 b1 fc 94 43 04 04</td></tr>
</table>

After merging the bytes, we should check which sensor type has been configuret to take this measurement. Depending on the sensor type, parsing will be changed.

### If sensor type is =1 (Accelerometer)

Each 2 byte represents a acceleroemter value. And each 6 byte represents three different axis value of one sample.

<table>

<tr><td>Merged Bytes</td><td>
b1 fc a8 43 60 04
a8 fc a9 43 2c 04
c3 fc b2 43 21 04
99 fc f0 43 35 04
d5 fc a2 43 41 04
c6 fc a0 43 46 04
b7 fc f1 43 03 04
b1 fc 94 43 04 04</td></tr>
<tr><td>Int16 representation</td><td> 
-847  17320   1120
-856  17321   1068
-829  17330   1057
-871  17392   1077
-811  17314   1089
-826  17312   1094
-841  17393   1027
   -847  17300   1028</td>
</tr>
<tr>
	<td>
	Accelerometer Range Corrected(2G)
	</td>
	<td>
<span style="color:red">    -0.051667</span>
<span style="color:green">  1.05652</span>
<span style="color:blue">   0.06832</span>
<span style="color:red">    -0.052216</span>
<span style="color:green">  1.056581</span>
<span style="color:blue">   0.065148</span>
<span style="color:red">    -0.050569</span>
<span style="color:green">  1.05713</span>
<span style="color:blue">   0.064477</span>
<span style="color:red">    -0.053131</span>
<span style="color:green">  1.060912</span>
<span style="color:blue">   0.065697</span>
<span style="color:red">    -0.049471</span>
<span style="color:green">  1.056154</span>
<span style="color:blue">   0.066429</span>
<span style="color:red">    -0.050386</span>
<span style="color:green">  1.056032</span>
<span style="color:blue">   0.066734</span>
<span style="color:red">    -0.051301</span>
<span style="color:green">  1.060973</span>
<span style="color:blue">   0.062647</span>
<span style="color:red">    -0.051667</span>
<span style="color:green">  1.0553</span>
<span style="color:blue">   0.062708</span>
	</td>
</tr>
<tr>
	<td>
	X
	</td>
	<td>
<span style="color:red">    -0.051667</span>
<span style="color:red">    -0.052216</span>
<span style="color:red">    -0.050569</span>
<span style="color:red">    -0.053131</span>
<span style="color:red">    -0.049471</span>
<span style="color:red">    -0.050386</span>
<span style="color:red">    -0.051301</span>
<span style="color:red">    -0.051667</span>
	</td>
</tr>
<tr>
<td>
Y
</td>
<td>
<span style="color:green">  1.05652</span>
<span style="color:green">  1.056581</span>
<span style="color:green">  1.05713</span>
<span style="color:green">  1.060912</span>
<span style="color:green">  1.056154</span>
<span style="color:green">  1.056032</span>
<span style="color:green">  1.060973</span>
<span style="color:green">  1.0553</span>
</td>
</tr>
<tr>
<td>
Z
</td>
<td>
<span style="color:blue">   0.06832</span>
<span style="color:blue">   0.065148</span>
<span style="color:blue">   0.064477</span>
<span style="color:blue">   0.065697</span>
<span style="color:blue">   0.066429</span>
<span style="color:blue">   0.066734</span>
<span style="color:blue">   0.062647</span>
<span style="color:blue">   0.062708</span>
</td>
</tr>
</table>

### If sensor type is =2 (Magnetometer)

Each 2 byte represents a magnetometer value. And each 6 byte represents three different axis value of one sample.

<table>
<tr><td>Merged Bytes</td><td>00 00 00 00 fe ff 00 00 00 00 fe ff 00 01 00 ff</td></tr>
<tr><td>Int16 representation</td><td> 0 0 -2 0 0 -2 0 1 -1</td></tr>
<tr>
<tr><td>X</td><td>0,0,0 </td></tr>
<tr><td>Y</td><td>0,0,1 </td></tr>
<tr><td>Z</td><td>-2,-2,-1</td> </tr>
</tr>
</table>

### If sensor type is =3 (Accelerometer|Magnetometer)

When sensorType is 3, device simultaniously take samples from accelerometer and magnetometer,
due to differences of samplingrates, the amount of sample sizes between accelerometer and sampling rate differ.
We can know the difference by reading the config value `N_ACC_PER_READ` and `N_MAG_PER_READ` in the `/done` message
N_ACC_PER_READ indicates after each  `N_ACC_PER_READ` sample of accelerometer there is `N_MAG_PER_READ` sample of magnetometer.

For example if sensorType is 3 and N_ACC_PER_READ =4 and N_MAG_PER_READ = 1
<table>
<tr><td>Merged Bytes</td><td>
b1 fc a8 43 60 04
a8 fc a9 43 2c 04
c3 fc b2 43 21 04
00 00 00 00 fe ff
99 fc f0 43 35 04
d5 fc a2 43 41 04
c6 fc a0 43 46 04
00 00 00 00 fe ff </td>
</tr>
<tr><td>Int16 representation</td><td> 
-847 	17320   1120
-856 	17321   1068
-829 	17330   1057
0		0		-2
-871	17392   1077
-811	17314   1089
-826	17312   1094
0 		0		-2
</td></tr>
<tr>
<tr><td>Acceleroemter Data </td><td>-847 	17320   1120
-856 	17321   1068
-829 	17330   1057
-871	17392   1077
-811	17314   1089
-826	17312   1094</td></tr>
<tr><td>Magnetometer Data </td><td>0		0		-2 0		0		-2</td></tr>
<tr><td>Accelerometer X</td><td><span style="color:red">    -0.051667</span>
<span style="color:red">    -0.052216</span>
<span style="color:red">    -0.050569</span>
<span style="color:red">    -0.053131</span>
<span style="color:red">    -0.049471</span>
<span style="color:red">    -0.050386</span></td></tr>
<tr><td>Accelerometer Y</td><td><span style="color:green">  1.05652</span>
<span style="color:green">  1.056581</span>
<span style="color:green">  1.05713</span>
<span style="color:green">  1.060912</span>
<span style="color:green">  1.056154</span>
<span style="color:green">  1.056032</span></td></tr>
<tr><td>Accelerometer Z</td><td><span style="color:blue">   0.06832</span>
<span style="color:blue">   0.065148</span>
<span style="color:blue">   0.064477</span>
<span style="color:blue">   0.065697</span>
<span style="color:blue">   0.066429</span>
<span style="color:blue">   0.066734</span></td> </tr>
<tr><td>Magnetometer X</td><td>0,0 </td></tr>
<tr><td>Magnetometer Y</td><td>0,0 </td></tr>
<tr><td>Magnetometer Z</td><td>-2,-2</td> </tr>
</tr>
</table>

### Accelerometer Range Correction

Int values must be multiplied by the correction coefficient. This changes according to the accelerometer range and is as follows. `range * 2/2 ^ 16`

<table>
	<tr>
		<th>Range</th>
		<th><code>range*2/2^16</code></th>
	</tr>
	<tr>
		<td>2</td>
		<td>0.000061</td>
	</tr>
	<tr>
		<td>4</td>
		<td>0.000122</td>
	</tr>
	<tr>
		<td>8</td>
		<td>0.000244</td>
	</tr>
	<tr>
		<td>16</td>
		<td>0.000488</td>
	</tr>
</table>

<br>

<br>

## Device Firmware Update(OTA)

Sensemore end node devices accept firmware update over http. In order to start firmware update on end-node device, valid binary link sent to firmware update topic.

<table>
<tr>
<th>Actor</th>
<th>Topic</th>
<th>Payload Type</th>
<th>Payload Schema</th>
<th>Example</th>
</tr>
<tr>
<td>
User
</td>

<td><b>lake/gateway/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt;/ota</b></td>
<td>string</td>
<td>
<i>http url</i>
</td>
<td>
http://ftp.mydomain.com/Wired1.0.10.gbl
</td>
</tr>
<tr>
<td>
Senseway
</td>

<td><b>lake/gateway/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt;/ota/accepted</b></td>
<td><i>empty</i></td>
<td><i>empty</i></td>
<td></td>
</tr>
<tr>
<td>
Senseway
</td>

<td><b>lake/gateway/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt;/ota/rejected</b></td>
<td><i>Error Code</i></td>
<td><i>NO_DEVICE</i></td>
<td></td>
</tr>
<tr>
<td>
Senseway
</td>
<td><b>lake/gateway/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt;/ota/done</b></td>
<td><i>empty</i></td>
<td><i>empty</i></td>
<td></td>
</tr>
</table>

> Caution: A binary url should be `http` not ~`https`~

Senseway downloads the binary from given url and start firmware update for particular device.

Firmware updates led sequence of wired end nodes shown in the <a href="#/wired?id=_1wired-device-statuses-and-led-indicator">Wired documentation.</a>

## TLS

Senseway devices implement TLS for a secure mqtt connection. If you manage your mqtt broker yourself, it is necessary to configure the broker's TLS and generate the required certificates.

### Mosquitto Configuration

Referance:
http://www.steves-internet-guide.com/mosquitto-tls/
https://mosquitto.org/man/mosquitto-conf-5.html

Example configuration of ` mosquitto.conf`

```
port 8883
cafile C:\mosquitto\certs\ca.crt
keyfile C:\mosquitto\certs\server.key
certfile C:\mosquitto\certs\server.crt
tls_version tlsv1.2
```

### Certificate Generation

Referance:
http://www.steves-internet-guide.com/creating-and-using-client-certificates-with-mqtt-and-mosquitto/
Requirement: `openssl`

#### CA Generation

ca.key: `openssl genrsa -des3 -out ca.key 2048`

ca.crt: `openssl req -new -x509 -days 1826 -key ca.key -out ca.crt`

#### Server Certificate Generation

server.key `openssl genrsa -out server.key 2048`

server.csr ` openssl req -new -out server.csr -key server.key`

> While generating a Certificate Signing Request (CSR), you should write the domain name of your broker server in the "common name" field in the form filled in. If your server does not have a domain name, you must type in the IP address directly.

Normally, for certificate generation, the CRS is sent to the CA and the CA signs the CRS and generates a valid certificate. In this example, we can generate the certificate because we are the CA.

server.crt `openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 3600`

Now `ca.crt`,`server.crt` and `server.key` can be used to configure mosquitto service with TLS support.

#### Client Certificate Generation

client.key `openssl genrsa -out client.key 2048`

client.csr `openssl req -new -out client.csr -key client.key`

> While generating a Certificate Signing Request (CSR), you should write the domain name of your broker server in the "common name" field in the form filled in. If your server does not have a domain name, you must type in the IP address directly.

client.crt `openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 360`

Now, MQTT clients (Senseway) can establish a secure connection to the mqtt server using `ca.crt`,` client.crt` and `client.key`.

## Tips

-   If you are using mosquitto as a broker, you can view detailed logs by launching the application in verbose mode to solve potential problems.

-   Configuration page or open the laptop to the desktop computer offers a more robust link.

-   If you can manage the Wifi network, defining a static ip for the senseway can prevent DHCP-related problems that may occur in the future. (Weak modems, device networking problems).

-   Storing measurement signal data in any database may cause various difficulties due to the data shape, it will be convenient to save directly in the file system.

-   You should check beforehand that your wifi network is healthy and that you have access to mqtt servers.

[def]: #senseway-mqtt-integration
