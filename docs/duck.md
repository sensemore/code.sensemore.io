<h1>Sensemore DUCK </h1>
<img src="images/Sensemore_product_duck.gif"/>


<h2>Introduction</h2>

Sensemore DUCK is a compact IoT data
acquisition hardware to collect process
data not only vibration, temperature, and
pressure but also whole analog data such
as; mass flow rate, speed, current, etc.
DUCK supports a maximum sampling rate of 
6400 Hz and it intelligently adjusts the
sampling rate based on the number of 
enabled channels.
Send the collected data to the cloud via
Wi-Fi or Ethernet. Monitor all metrics of data on
Sensemore Platform: LAKE. Find the root
causes of your machinery anomalies either
manually or by using predictive analytic
tools.

Measure real-time data at lower sampling frequency for digital twin applications. Synchronously collected data are correlated with your models and monitored online. After data acquisition, Sensemore Platform LAKE offers ready advanced  signal processing tools to detect early- stage machinery failures required by expert analysts or plant operators.


## Accessing Web Configuration Page

Shortly after the Duck is plugged in, it broadcats a Wi-Fi acces point network with **DUCK-CA&colon;B8&colon;DA&colon;XX&colon;XX&colon;XX** SSID'. Use default password "sensemore" to connect AP network, Open your browser and navigate to adress [http:\\\\192.168.4.1 ](http:\192.168.4.1)

## MQTT Broker and Certificates

Duck needs MQTT / TLS configuration and supports variety of authentication mechanisms including: plaintext MQTT, MQTTs with and without password, and MQTTs with Client certificate.  
The MQTT Broker Server to be used must support TLS  and provide the following for certificate-based connections:

-   MQTT endpoint (_mqtts: //my-mqtt-broker.server: 8883_)
-   CA (CA certificate)
-   Client Cert (a created and signed certificate from CA)
-   Client Key (private key of the certificate generated through the CA)

Required certificates and endpoint information are defined in 'Advance> MQTT' via the Duck configuration page. Duck uses these certificates for the future MQTT connections.

Details
https://www.hivemq.com/blog/mqtt-security-fundamentals-tls-ssl/

## NTP

_Default: http://pool.ntp.org/_
Time information is used in the measurement messages sent by Duck, therefore time synchronization is required. For OnPremise installations, the time server can be defined from `Advance > NTP`.


## Operations

This section explains which topics to use when communicating with Duck and how messages should be interpreted.

`Actor` sends `Payload` with `PayloadType` format to `Topic`

### Information

When Duck first wakes up, it publishes an status message to with basic information about the device.

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
Duck
</td>

<td><b>sensemore/&lt;DeviceMac&gt;/info/accepted</b></td>

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

### Firmware Version

Duck firmware version is included in the info message.

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
<b> sensemore/&lt;DeviceMac&gt;/info</b>
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
	<b> sensemore/&lt;DeviceMac&gt;/info/accepted</b>
	</td>
	<td>
	JSON
	</td>
	<td>
	<i>Info JSON</i>
	</td>
	<td>
	"Version": "3.0.0"
	</td>
</tr>
</table>

### Sensor Configuration

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
<b> sensemore/&lt;DeviceMac&gt;/config/get</b>
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
	<b> sensemore/&lt;DeviceMac&gt;/config/get/accepted</b>
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
<b> sensemore/&lt;DeviceMac&gt;/config/set</b>
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
	<b> sensemore/&lt;DeviceMac&gt;/config/set/accepted</b>
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

### Measurement

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
<b> sensemore/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt;/measure/&lt;MEASUREMENT_UUID&gt;</b>
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
	<b> sensemore/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt;/measure/&lt;MEASUREMENT_UUID&gt;/accepted<b>
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
	<b> sensemore/&lt;DeviceMac&gt;/device/&lt;DeviceMac&gt;/measure/&lt;MEASUREMENT_UUID&gt;/metadata<b>
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

## Firmware Update Over the Air (OTA)

Sensemore devices accept firmware update over HTTP. In order to start firmware update on the device, valid binary link sent to firmware update topic.

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

<td><b>sensemore/&lt;DeviceMac&gt;/ota</b></td>
<td>JSON</td>
<td>
<i>http url</i>
</td>
<td>
{
  "url" : "http://link.mydomain.com/Duck.bin"  
}
</td>
</tr>
<tr>
<td>
Duck
</td>

<td><b>sensemore/&lt;DeviceMac&gt;/ota/accepted</b></td>
<td><i>JSON</i></td>
<td><i>Status JSON</i></td>
<td>
{
  "status": "OTA accepted"
}
</td>
</tr>
<tr>
<td>
Duck
</td>

<td><b>sensemore/&lt;DeviceMac&gt;/ota/rejected</b></td>
<td><i>Text</i></td>
<td><i>Error Text</i></td>
<td>
Invalid payload! Url can't be null. Valid payload scheme: {
	"url":"http://example.com"
}
</td>
</tr>
<tr>
<td>
Duck
</td>
<td><b>lake/gateway/&lt;DeviceMac&gt;/restart</b></td>
<td><i>JSON</i></td>
<td><i>Status JSON</i></td>
<td>
{
  "status": "Restarting device due to OTA"
}
</td>
</tr>
</table>

> Caution: A binary url should be `http` not ~`https`~

Duck downloads the binary from given url and start firmware update.

## TLS

Duck devices implement TLS for a secure mqtt connection. If you manage your mqtt broker yourself, it is necessary to configure the broker's TLS and generate the required certificates.

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

Now, MQTT clients (Duck) can establish a secure connection to the mqtt server using `ca.crt`,` client.crt` and `client.key`.

## Tips

-   If you are using mosquitto as a broker, you can view detailed logs by launching the application in verbose mode to solve potential problems.

-   Configuration page or open the laptop to the desktop computer offers a more robust link.

-   If you can manage the Wifi network, defining a static ip for the Duck can prevent DHCP-related problems that may occur in the future. (Weak modems, device networking problems).

-   Storing measurement signal data in any database may cause various difficulties due to the data shape, it will be convenient to save directly in the file system.

-   You should check beforehand that your wifi network is healthy and that you have access to mqtt servers.

