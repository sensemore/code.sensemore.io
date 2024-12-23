# <span style="color: rgb(240,95,34)">Wired Pro Wi-Fi Integration Documentation</span>  

### <span style="color: rgb(240,95,34)">Wired Pro Operational Modes</span>

:exclamation: Wired Pro is a versatile IoT data acquisition device with two distinct operational modes:  
**1. RS485 mode:**  
In this mode, Wired Pro connects to Senseway (or other gateways) via an RS485 cable. It is controlled by the gateway and operates as a 3-axis accelerometer, magnetometer, and temperature sensor. For more details, refer to the [Senseway Integration Documentation](senseway_system_integration.md).  
**2. Wi-Fi mode:**  
In Wi-Fi mode, Wired Pro functions as its own gateway, managing its sensors independently. This documentation focuses on the Wi-Fi mode.

<img src="images/Sensemore_product_wiredpro.gif"/>  

Wired Pro Wi-Fi is a combined gateway and sensor array capable of capturing 3-axis accelerometer, magnetic field, and temperature readings. It can process measurements, apply measurement strategies, and upload data to the cloud. Powered by a 5-36V DC input, Wired Pro Wi-Fi operates without the need for charging.

Chekout Wired Pro Wi-Fi data sheet _<http://sensemore.io/>_  
Chekout Wired Pro Wi-Fi installation guide _<http://sensemore.io/>_

Before starting to speak about Wired Pro system integration, configure your Wired Pro's MQTT, NTP and HTTP settings. 

### <span style="color: rgb(240,95,34)">Accessing Configuration Page</span>

Shortly after the Wired Pro is plugged in, it broadcats a Wi-Fi acces point network with **WiredPro-CA&colon;B8&colon;41&colon;XX&colon;XX&colon;XX** SSID'. Use default password to connect to the AP. Your device will launch configuration page in captive portal. If your device does not automatically launch captive portal, navigate to [http:\\\\192.168.4.1 ](http:\192.168.4.1) in your default browser.  
Once Wired Pro is connected to a network via Wi-Fi, its configuration page can be accessed through its local IP address from the same network. The local IP address is displayed on the home tab of the configuration page and is also shown in the MQTT information message.

## <span style="color: rgb(240,95,34)">Connectivity</span>

### <span style="color: rgb(240,95,34)">Wi-Fi</span>
Wired Pro supports Wi-Fi for wireless network connections.

### <span style="color: rgb(240,95,34)">NTP</span>
Time information is also used in the measurement messages sent by Wired Pro. Time synchronization is needed for this. For OnPremise or private installations, default NTP server can be modified in Wired Pro Configuration page `Settings > NTP`.  
_Default: <http://pool.ntp.org/>_

### <span style="color: rgb(240,95,34)">MQTT</span>
Wired Pro needs MQTT / TLS configuration and supports variety of authentication mechanisms including: plaintext MQTT, MQTTs with and without password, and MQTTs with Client certificate.  
The MQTT Broker Server to be used must support TLS  and provide the following for certificate-based connections:

-   MQTT endpoint (_mqtts: //my-mqtt-broker.server: 8883_)
-   CA (CA certificate)
-   Client Cert (a created and signed certificate from CA)
-   Client Key (private key of the certificate generated through the CA)

Required certificates and endpoint information are defined at `Settings > MQTT` in the Wired Pro configuration page. Wired Pro uses these certificates for the future MQTT connections.

Details
https://www.hivemq.com/blog/mqtt-security-fundamentals-tls-ssl/

### <span style="color: rgb(240,95,34)">HTTP</span>
HTTP here..


## <span style="color: rgb(240,95,34)">MQTT Integration</span>

This section explains which topics to use when communicating with Wired Pro over MQTT and how messages should be interpreted.

`Actor` sends `Payload` with `PayloadType` format to `Topic`

### <span style="color: rgb(240,95,34)">Information</span>

When Wired Pro powers on, it publishes a status message containing basic device information including **Firmware Verion**. This status message can also be retrieved using the following topic:

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
<b> sensemore/&lt;GatewayMac&gt;/info</b>
</td>
<td>
JSON
</td>
<td>
<i>Empty JSON</i>
</td>
<td>
<i></i>
</td>
</tr>
<tr>
<td>
Wired Pro
</td>

<td><b>sensemore/&lt;GatewayMac&gt;/info/accepted</b></td>

<td>JSON</td>
<td>

```json
{
  "Product": "WIREDPRO",
  "Current Running Application": "WIREDPRO_VERSION>",
  "Version": "<FIRMWARE_VERSION>",
  "Compile Date": "<FIRMWARE_COMPILE_DATE>",
  "Compile Time": "<FIRMWARE_COMPILE_TIME>",
  "ESP-IDF Version": "<ESPRESSIF_IDF_VERSION>",
  "RSSI": <RECEIVED_SIGNAL_STRENTGH_INDICATOR>,
  "Local IP": "<ASSIGNED_LOCAL_IP>",
  "Network MAC": "<NETWORK_MAC_ADDRESS>",
  "Last Reset Reason": "<RESET_REASON>",
  "Runtime MS": <TIME_SINCE_LAST_RESET>,
  "Memory Info": {
    "Total Free Bytes": <STORAGE_CAPACITY>,
    "Total Allocated Bytes": <USABLE_STORAGE>,
    "Min Free Bytes": <MIN_FREE_BTYES>,
    "Largest Free Bytes": <LARGEST_FREE_BYTES>
  }
}
```
</td>
<td>

```json
{
  "Product": "WIREDPRO",
  "Current Running Application": "WiredPro-3-0-0",
  "Version": "3.0.0",
  "Compile Date": "Jan 8 2018",
  "Compile Time": "12:00:00",
  "ESP-IDF Version": "v5.1.4",
  "RSSI": -60,
  "Local IP": "192.168.1.161",
  "Network MAC": "00:00:00:00:00:00",
  "Last Reset Reason": "POWERON",
  "Runtime MS": 1231660,
  "Memory Info": {
    "Total Free Bytes": 66576,
    "Total Allocated Bytes": 198868,
    "Min Free Bytes": 60216,
    "Largest Free Bytes": 40960
  }
}
```
</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Firmware Update Over the Air (OTA)</span>

Sensemore devices accept firmware update over HTTP. In order to start firmware update on the device, valid binary link sent to firmware update topic. Wired Pro downloads the binary from given url and start firmware update.

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

<td><b>sensemore/&lt;GatewayMac&gt;/ota</b></td>
<td>JSON</td>
<td>
<i>http url</i>
</td>
<td>

```json
{
  "url" : "http://link.mydomain.com/WiredPro.bin"  
}
```
</td>
</tr>
<tr>
<td>
Wired Pro
</td>

<td><b>sensemore/&lt;GatewayMac&gt;/ota/accepted</b></td>
<td><i>JSON</i></td>
<td><i>Status JSON</i></td>
<td>

```json
{
  "status": "OTA accepted"
}
```
</td>
</tr>
<tr>
<td>
Wired Pro
</td>

<td><b>sensemore/&lt;GatewayMac&gt;/ota/rejected</b></td>
<td><i>Text</i></td>
<td><i>Error Text</i></td>
<td>
Invalid payload! Url can't be null. Valid payload scheme: {
	"url":"http://link.mydomain.com/Wired Pro.bin"
}
</td>
</tr>
<tr>
<td>
Wired Pro
</td>
<td><b>sensemore/&lt;GatewayMac&gt;/restart</b></td>
<td><i>JSON</i></td>
<td><i>Status JSON</i></td>
<td>

```json
{
  "status": "Restarting device due to OTA"
}
```
</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Restart</span>

Wired Pro can be restarted using the following topic.

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
<b> sensemore/&lt;GatewayMac&gt;/restart</b>
</td>
<td>
JSON
</td>
<td>
<i>Empty JSON</i>
</td>
<td>
<i></i>
</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Device Configuration</span>

Wired Pro’s measurement strategy and configuration can be retrieved using the following topic.

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
<b> sensemore/&lt;GatewayMac&gt;/devices/get</b>
</td>
<td>
JSON
</td>
<td>
<i>Empty JSON</i>
</td>
<td>
<i></i>
</td>
</tr>
<tr>
 <td>
 Wired Pro
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/devices/get/accepted</b>
 </td>
 <td>
 JOSN
 </td>
 <td>
 <i>Device Config JSON</i>
 </td>
 <td>

 ```json
{
  "devices": [
    {
      "mac": "CA:B8:41:XX:XX:XX",
      "status": "connected",
      "version": "3.0.0",
      "device_config": {
        "accelerometer_range": 16,
        "sampling_rate": 25600,
        "sample_size": 50000,
        "scheduler_enabled": false,
        "scheduler_period": 0
      }
    }
  ]
}
```
 </td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Measurement Configuration</span>

Wired Pro's measurement configuration can be viewed or modifyed over MQTT with the following topics. 

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
<b> sensemore/&lt;GatewayMac&gt;/device/&lt;GatewayMac&gt;/config/get</b>
</td>
<td>
JSON
</td>
<td>
<i>Empty JSON</i>
</td>
<td>
<i></i>
</td>
</tr>
<tr>
 <td>
 Wired Pro
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/device/&lt;GatewayMac&gt;/config/get/accepted</b>
 </td>
 <td>
 JOSN
 </td>
 <td>
 <i>Config JSON</i>
 </td>
 <td>

 ```json
{
  "device_mac": "CA:B8:XX:XX:XX:XX",
  "device_config": {
    "accelerometer_range": 16,
    "sampling_rate": 25600,
    "sample_size": 50000,
    "scheduler_enabled": false,
    "scheduler_period": 0
  }
}
```
 </td>
</tr>
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
<b> sensemore/&lt;GatewayMac&gt;/device/&lt;GatewayMac&gt;/config/set</b>
</td>
<td>
JSON
</td>
<td>
<i>Config JSON</i>
</td>
<td>
<i>

```json
{
  "device_mac": "CA:B8:XX:XX:XX:XX",
  "device_config": {
    "accelerometer_range": 16,
    "sampling_rate": 25600,
    "sample_size": 50000,
    "scheduler_enabled": false,
    "scheduler_period": 0
  }
}
```
</i>
</td>
</tr>
<tr>
 <td>
 Wired Pro
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/device/&lt;GatewayMac&gt;/config/set/accepted</b>
 </td>
 <td>
 JOSN
 </td>
 <td>
 <i>Status JSON</i>
 </td>
 <td>

 ```json
{
  "device_mac": "CA:B8:41:DE:AD:00",
  "device_config": {
    "accelerometer_range": 16,
    "sampling_rate": 25600,
    "sample_size": 50000,
    "scheduler_enabled": false,
    "scheduler_period": 0
  },
  "status": "Device config updated"
}
```
 </td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Measurement</span>

Wired Pro initiates automatic measurement using the scheduling feature. It also accepts manual measurements from the Sensemore Lake platform as well as  MQTT based on the configurations set previously. MQTT measurement topics are as follows.

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
<td><b>sensemore/&lt;GatewayMac&gt;/device/&lt;GatewayMac&gt;/measure/&lt;MEASUREMENT_UUID&gt;</b></td>
<td>JSON</td>
<td>
<i>Empty JSON</i>
</td>
<td>
</td>
</tr>
<tr>
<td>
Wired Pro
</td>
<td><b>sensemore/&lt;GatewayMac&gt;/device/&lt;GatewayMac&gt;/measure/&lt;MEASUREMENT_UUID&gt;/accepted</b></td>
<td><i>JSON</i></td>
<td><i>Status JSON</i></td>
<td>

```json
{
  "status": "success"
}
```
</td>
</tr>
<tr>
<td>
Wired Pro
</td>

<td><b>sensemore/&lt;GatewayMac&gt;/device/&lt;GatewayMac&gt;/measure/&lt;MEASUREMENT_UUID&gt;/metadatas</b></td>
<td><i>JSON</i></td>
<td><i>Metadata JSON</i></td>
<td>

```json
{
  "unixtimestamp": 1734617027,
  "sum_x": -3250.361328125,
  "sum_y": 1844.42333984375,
  "sum_z": -7643.8251953125,
  "mean_x": -0.39005896173346932,
  "mean_y": 0.2213396543674247,
  "mean_z": -0.91729571526611065,
  "peak_x": 0.038008180483469323,
  "peak_y": 0.0423322206325753,
  "peak_z": 0.039735534733889355,
  "peak_to_peak_x": 0.07373046875,
  "peak_to_peak_y": 0.0791015625,
  "peak_to_peak_z": 0.07080078125,
  "clearance_x": 164.31150332922692,
  "clearance_y": 193.61163139253921,
  "clearance_z": 195.9534386192756,
  "crest_x": 7.6797359331360573,
  "crest_y": 8.9543432043988656,
  "crest_z": 9.27409693825784,
  "vrms_x": 0.017510145845642453,
  "vrms_y": 0.050003347640017633,
  "vrms_z": 0.01880110921075584,
  "grms_x": 0.0049491520039737225,
  "grms_y": 0.00472756288945675,
  "grms_z": 0.0042845718562603,
  "kurtosis_x": 17.458915614260821,
  "kurtosis_y": 18.276360133218649,
  "kurtosis_z": 17.757537090857209,
  "skewness_x": 0.65933222563406724,
  "skewness_y": 1.4794854818975853,
  "skewness_z": -1.0167293724548387,
  "temperature": 41.1187515258789,
  "calibrated_sampling_rate": 26513,
  "sampling_rate": 25600,
  "sample_size": 50000,
  "accelerometer_range": 16,
  "measurement_buffer_size": 300000
}
```
</td>
</tr>
<tr>
<td>
Wired Pro
</td>
<td><b>sensemore/&lt;GatewayMac&gt;/device/&lt;GatewayMac&gt;/measure/&lt;MEASUREMENT_UUID&gt;/done</b></td>
<td><i>JSON</i></td>
<td><i>Status JSON</i></td>
<td>

```json
{
  "status": "Measurement done"
}
```
</td>
</tr>
</table>

## <span style="color: rgb(240,95,34)">HTTP Integration</span>

heree.