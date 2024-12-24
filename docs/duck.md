# <span style="color: rgb(240,95,34)">Duck Integration Document</span>
<img src="images/Sensemore_product_duck.gif"/>


Sensemore Duck is a compact IoT data
acquisition hardware to collect process
data not only vibration, temperature, and
pressure but also whole analog data such
as; mass flow rate, speed, current, etc.

Chekout Duck data sheet _<http://sensemore.io/>_  
Chekout Duck installation guide _<http://sensemore.io/>_

Before starting to speak about Duck system integration, configure your Duck's MQTT, NTP and HTTP settings. 

### <span style="color: rgb(240,95,34)">Accessing Configuration Page</span>

Shortly after the Duck is plugged in, it broadcats a Wi-Fi acces point network with **DUCK-CA&colon;B8&colon;DA&colon;XX&colon;XX&colon;XX** SSID'. Use default password to connect to the AP. Your device will launch configuration page in captive portal. If your device does not automatically launch captive portal, navigate to [http:\\\\192.168.4.1 ](http:\192.168.4.1) in your default browser.  
Once Duck is connected to a network via Wi-Fi or Ethernet, its configuration page can be accessed through its local IP address from the same network. The local IP address is displayed on the home tab of the configuration page and is also shown in the MQTT information message.

## <span style="color: rgb(240,95,34)">Connectivity</span>

### <span style="color: rgb(240,95,34)">Wi-Fi & Ethernet</span>
Duck supports both Wi-Fi and Ethernet for network connections. By default, the network adapter is set to Wi-Fi, but this can be modified in the Settings of the Configuration page `Settings > Connectivity`.

### <span style="color: rgb(240,95,34)">NTP</span>
Time information is also used in the measurement messages sent by Duck. Time synchronization is needed for this. For OnPremise or private installations, default NTP server can be modified in Duck Configuration page `Settings > NTP`.  
_Default: <http://pool.ntp.org/>_

### <span style="color: rgb(240,95,34)">MQTT</span>
Duck needs MQTT / TLS configuration and supports variety of authentication mechanisms including: plaintext MQTT, MQTTs with and without password, and MQTTs with Client certificate.  
The MQTT Broker Server to be used must support TLS  and provide the following for certificate-based connections:

-   MQTT endpoint (_mqtts: //my-mqtt-broker.server: 8883_)
-   CA (CA certificate)
-   Client Cert (a created and signed certificate from CA)
-   Client Key (private key of the certificate generated through the CA)

Required certificates and endpoint information are defined at `Settings > MQTT` in the Duck configuration page. Duck uses these certificates for the future MQTT connections.

Details
https://www.hivemq.com/blog/mqtt-security-fundamentals-tls-ssl/

### <span style="color: rgb(240,95,34)">HTTP</span>
HTTP here..

## <span style="color: rgb(240,95,34)">Duck Sensor Configuration</span>

Duck is compatible with industry standard **4-20mA** sensors. Duck sensor configuration consists of sensor groups. Each group is indented to monitor a
single point on an equipment.  
- Multiple sensors can be grouped in a single sensor group to monitor different
characteristics of a point such as temperature and humidity or acceleration and magnetic
field.  
- One sensor can be configured with one or multiple input channels depending on sensor's
functionality. For example, distance sensor is configured with a single input channel
whereas 3-axis acceleration sensor is configured with 3 input channels for x, y z axes.

<table>
<tr>
<th>Device Config</th>
<th>Explaniation</th>
</tr>
<tr>
<td>

```json

{
  "heartbeat_interval_min": 15,
  "sensor_groups": [
    {
      "sensor_group_code": "fe1e2714-5ac0-404c-9eb1-20f3a1d2a214",
      "sensors": [
        {
          "sensor": "accelerometer",
          "channels": [
            0,
            1,
            2
          ],
          "channel_codes": [
            "accelerometer_x",
            "accelerometer_y",
            "accelerometer_z"
          ],
          "min_max_voltage": [
            -5,
            5
          ],
          "min_max_value": [
            -1000,
            1000
          ],
          "trigger_differancel_rate": 2
        }
      ]
    }
  ]
}
```

</td>
<td>

```json

{
  "heartbeat_interval_min": 15,
  "sensor_groups": [
    {
      "sensor_group_code": "fe1e2714-5ac0-404c-9eb1-20f3a1d2a214",
      "sensors": [
        {
          "sensor": "accelerometer",
          "channels": [
            0,
            1,
            2
          ],
          "channel_codes": [
            "accelerometer_x",
            "accelerometer_y",
            "accelerometer_z"
          ],
          "min_max_voltage": [
            -5,
            5
          ],
          "min_max_value": [
            -1000,
            1000
          ],
          "trigger_differancel_rate": 2
        }
      ]
    }
  ]
}
```
</td>
<td>
</tr>
</table>

## <span style="color: rgb(240,95,34)">MQTT Integration</span>

This section explains which topics to use when communicating with Duck over MQTT and how messages should be interpreted.

`Actor` sends `Payload` with `PayloadType` format to `Topic`

### <span style="color: rgb(240,95,34)">Information</span>

When Duck powers on, it publishes a status message containing basic device information including **Firmware Version**. This status message can also be retrieved using the following topic:

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
<b> sensemore/&lt;DuckMac&gt;/info</b>
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
Duck
</td>

<td><b>sensemore/&lt;DuckMac&gt;/info/accepted</b></td>

<td>JSON</td>
<td>

```json
{
  "Product": "Duck",
  "Current Running Application": "<DUCK_VERSION>",
  "Version": "<FIRMWARE_VERSION>",
  "Compile Date": "<FIRMWARE_COMPILE_DATE>",
  "Compile Time": "<FIRMWARE_COMPILE_TIME>",
  "ESP-IDF Version": "<ESPRESSIF_IDF_VERSION>",
  "Network Mode": "<SELECTED_NETWORK_ADAPTOR>",
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
  "Product": "Duck",
  "Current Running Application": "Duck-3.0.0",
  "Version": "3.0.0",
  "Compile Date": "Jan 8 2018",
  "Compile Time": "12:00:00",
  "ESP-IDF Version": "v5.1.2",
  "Network Mode": "WIFI",
  "RSSI": -56,
  "Local IP": "192.168.1.153",
  "Network MAC": "00:00:00:00:00:00",
  "Last Reset Reason": "POWERON",
  "Runtime MS": 3244190,
  "Memory Info": {
    "Total Free Bytes": 4084904,
    "Total Allocated Bytes": 384008,
    "Min Free Bytes": 4038248,
    "Largest Free Bytes": 3997696
  }
}
```
</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Firmware Update Over the Air (OTA)</span>

Sensemore devices accept firmware update over HTTP. In order to start firmware update on the device, valid binary link sent to firmware update topic. Duck downloads the binary from given url and start firmware update.

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

<td><b>sensemore/&lt;DuckMac&gt;/ota</b></td>
<td>JSON</td>
<td>
<i>http url</i>
</td>
<td>

```json
{
  "url" : "http://link.mydomain.com/Duck.bin"  
}
```
</td>
</tr>
<tr>
<td>
Duck
</td>

<td><b>sensemore/&lt;DuckMac&gt;/ota/accepted</b></td>
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
Duck
</td>

<td><b>sensemore/&lt;DuckMac&gt;/ota/rejected</b></td>
<td><i>Text</i></td>
<td><i>Error Text</i></td>
<td>
Invalid payload! Url can't be null. Valid payload scheme: {
	"url":"http://link.mydomain.com/Duck.bin"
}
</td>
</tr>
<tr>
<td>
Duck
</td>
<td><b>sensemore/&lt;DuckMac&gt;/restart</b></td>
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

Duck can be restarted using the following topic.

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
<b> sensemore/&lt;DuckMac&gt;/restart</b>
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

### <span style="color: rgb(240,95,34)">Sensor Configuration</span>

Duck's sensor configuration can be viewed or changed over MQTT with the following topics.

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
<b> sensemore/&lt;DuckMac&gt;/config/get</b>
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
	Duck
	</td>
	<td>
	<b> sensemore/&lt;DuckMac&gt;/config/get/accepted</b>
	</td>
	<td>
	JSON
	</td>
	<td>
	<i>Config JSON</i>
	</td>
	<td>
	{
  "heartbeat_interval_min": 98,
  "sensor_groups": [
    {
      "sensor_group_code": "fe1e2714-5ac0-404c-9eb1-20f3a1d2a214",
      "sensors": [
        {
          "sensor": "accelerometer",
          "channels": [
            0
          ],
          "channel_codes": [
            "accelerometer_x"
          ],
          "min_max_voltage": [
            -5,
            5
          ],
          "min_max_value": [
            -1000,
            1000
          ],
          "trigger_differancel_rate": 2
        }
      ]
    }
  ]
}
	</td>
</tr>
</table>

:exclamation: Changing Duck’s sensor configuration will trigger a restart of the device.

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
<b> sensemore/&lt;DuckMac&gt;/config/set</b>
</td>
<td>
JSON
</td>
<td>
<i>Config JSON</i>
</td>
<td>
<i>
{
  "heartbeat_interval_min": 15,
  "sensor_groups": [
    {
      "sensor_group_code": "fe1e2714-5ac0-404c-9eb1-20f3a1d2a214",
      "sensors": [
        {
          "sensor": "accelerometer",
          "channels": [
            0
          ],
          "channel_codes": [
            "accelerometer_x"
          ],
          "min_max_voltage": [
            -5,
            5
          ],
          "min_max_value": [
            -1000,
            1000
          ],
          "trigger_differancel_rate": 2
        }
      ]
    }
  ]
}
</i>
</td>
</tr>
<tr>
	<td>
	Duck
	</td>
	<td>
	<b> sensemore/&lt;DuckMac&gt;/config/set/accepted</b>
	</td>
	<td>
	JSON
	</td>
	<td>
	<i>Status JSON</i>
	</td>
	<td>
	{
	"status": "OK, device will be restarted"
	}
	</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Measuremnt</span>

Duck device is designed for high-performance data acquisition with multiple ways to trigger measurements. It continuously collects data and evaluates conditions for publishing measurements based on the following mechanisms:  
**1.	Heartbeat:**
If no measurement has been published within a time period exceeding the configured heartbeat value, Duck automatically publishes a measurement.  
**2.	Trigger Difference:**
Duck publishes a measurement when the difference between the current and previous measurements exceeds the configured percentage threshold. The Trigger Difference can be adjusted in the device’s configuration settings.  
**3.	Sensemore Lake:**
Users can send manual measurement requests through the Sensemore Lake platform.  
**4.	MQTT:**
Manual measurement requests can also be sent via MQTT. Details about the MQTT topics are provided in down below.

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
<b> sensemore/&lt;DuckMac&gt;/device/&lt;DuckMac&gt;/measure/&lt;MEASUREMENT_UUID&gt;</b>
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
	Duck
	</td>
	<td>
	<b> sensemore/&lt;DuckMac&gt;/device/&lt;DuckMac&gt;/measure/&lt;MEASUREMENT_UUID&gt;/accepted<b>
	</td>
	<td>
	JSON
	</td>
	<td>
	<i>Status JSON</i>
	</td>
	<td>
	{
		"status": "initiated"
	}	
	</td>
	<tr>
	<td>
	Duck
	</td>
	<td>
	<b> sensemore/&lt;DuckMac&gt;/device/&lt;DuckMac&gt;/measure/&lt;MEASUREMENT_UUID&gt;/metadata<b>
	</td>
	<td>
	JSON
	</td>
	<td>
	<i>Metadata JSON</i>
	</td>
	<td>
	{
  "measurement_uid": "f86e2b10-6475-42ed-95ab-b37fe24ca888",
  "calibrated_sampling_rate": 6403,
  "sampling_rate": 6403,
  "unixtimestamp": "1734094422",
  "device-mac": "CA:B8:DA:DE:AD:00",
  "version": "3.0.0",
  "reason": "measurement_request",
  "channel0_rms": 1.504085898399353,
  "channel1_rms": -1,
  "channel2_rms": -1,
  "channel3_rms": -1,
  "channel4_rms": -1,
  "channel5_rms": -1,
  "channel6_rms": -1,
  "channel7_rms": -1,
  "config": {
    "heartbeat_interval_min": 98,
    "sensor_groups": [
      {
        "sensor_group_code": "fe1e2714-5ac0-404c-9eb1-20f3a1d2a214",
        "sensors": [
          {
            "sensor": "accelerometer",
            "channels": [
              0
            ],
            "channel_codes": [
              "accelerometer_x"
            ],
            "min_max_voltage": [
              -5,
              5
            ],
            "min_max_value": [
              -1000,
              1000
            ],
            "trigger_differancel_rate": 2
          }
        ]
      }
    ]
  }
}
	</td>
</tr>
</tr>
</table>

## <span style="color: rgb(240,95,34)">HTTP Integration</span>

heree.