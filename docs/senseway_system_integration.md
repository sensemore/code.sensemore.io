# Senseway System Integration

- [Senseway System Integration](#senseway-system-integration)
  - [Legacy Senseway MQTT Integration](#legacy-senseway-mqtt-integration)
    - [Accessing Web Configuration Page](#accessing-web-configuration-page)
    - [MQTT Broker and Certificates](#mqtt-broker-and-certificates)
    - [NTP](#ntp)
    - [Operations](#operations)
      - [Scan](#scan)
      - [Requesting Senseway Version](#requesting-senseway-version)
      - [Requesting Version for Endnode](#requesting-version-for-endnode)
    - [Measurement](#measurement)
      - [Measurement Configuration](#measurement-configuration)
      - [Topics](#topics)
      - [Chunk ordering and interpretation](#chunk-ordering-and-interpretation)
      - [Post Processing](#post-processing)
      - [Byte To Int](#byte-to-int)
      - [Accelerometer Range Correction](#accelerometer-range-correction)
      - [Example](#example)
    - [Device Firmware Update(OTA)](#device-firmware-updateota)
    - [Sleep](#sleep)
    - [TLS](#tls)
      - [Mosquitto Configuration](#mosquitto-configuration)
      - [Certificate Generation](#certificate-generation)
        - [CA Generation](#ca-generation)
        - [Server Certificate Generation](#server-certificate-generation)
        - [Client Certificate Generation](#client-certificate-generation)
    - [Tips](#tips)

:warning: Before starting to speak about Senseway System integration, to configure your Senseway's MQTT, NTP and HTTP settings refer to the "Senseway Configuration Manual" that came with your Senseway.

## <span style="color: rgb(240,95,34)">Legacy Senseway MQTT Integration</span>

| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="github" width="45" height="45"/> | Example Python project can be found at [sensemore-python-legacy-mqtt-client](https://github.com/sensemore/sensemore-python-mqtt-client) repostory. |
|---|---|

### <span style="color: rgb(240,95,34)">Accessing Web Configuration Page</span>

Shortly after the Senseway is plugged in, it opens a wifi acces point network with **Senseway-CA&colon;B8&colon;XX&colon;XX&colon;XX&colon;XX** SSID'. Use default password to connect AP network, Open your browser and navigate to adress [http:\\192.168.4.1](http:\192.168.4.1)

### <span style="color: rgb(240,95,34)">MQTT Broker and Certificates</span>

Senseway needs MQTT / TLS configuration. The MQTT Broker Server to be used must support TLS and have the required certificates for the senseway.

- MQTT endpoint (_mqtts: //my-mqtt-broker.server: 8883_)
- CA (CA certificate)
- Client Cert (a created and signed certificate from CA)
- Client Key (private key of the certificate generated through the CA)

Required certificates and endpoint information are defined in 'Advance> MQTT' via the Senseway configuration page. Senseway uses these certificates for the future MQTT connections.

Details
<https://www.hivemq.com/blog/mqtt-security-fundamentals-tls-ssl/>

### <span style="color: rgb(240,95,34)">NTP</span>

_Default: <http://pool.ntp.org/>_
Time information is also used in the measurement messages sent by Senseway. Time synchronization is needed for this. For OnPremise installations, the time server can be defined from `Advance > NTP`.

### <span style="color: rgb(240,95,34)">Operations</span>

It explains which topics to use when communicating with Senseway and how messages should be interpreted.

`Aktör` sends `Payload` with `PayloadType` format to `Topic`

#### <span style="color: rgb(240,95,34)">Scan</span>

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

<td><b>lake/gateway/&lt;SensewayID&gt;/scanDevice</b></td>

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

#### <span style="color: rgb(240,95,34)">Requesting Senseway Version</span>

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
<b> lake/gateway/&lt;SensewayID&gt;/client/SENSEWAY/version</b>
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
 <b> lake/gateway/&lt;SensewayID&gt;/client/SENSEWAY/version/accepted</b>
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

#### <span style="color: rgb(240,95,34)">Requesting Version for Endnode</span>

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
<b> lake/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt/version</b>
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
 <b> lake/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt/version/accepted</b>
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
 <b> lake/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt/version/rejected</b>
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

### <span style="color: rgb(240,95,34)">Measurement</span>

The measurement process starts with sending a configuration to the end device, then the measurement reading process begins. Measurement reading process is done with chunks. The subscriber user is required to interpret and parse the measurement reading packets in the correct order.

### <span style="color: rgb(240,95,34)">Measurement Configuration</span>

<table>
<tr>
<th>
Parameters
</th>
<th>
Valid values
</th>
<th>
Explanation
</th>
</tr>
<tr>
<td>
accelerometerRangeIndex
</td>
<td>
1<br> 2<br> 3<br> 4
</td>
<td>
2 G<br> 4 G<br> 8 G<br> 16 G
</td>
</tr>
<tr>
<td>
samplingRateIndex
</td>
<td>
5<br> 6<br>7<br> 8<br> 9<br> 10 <br>
</td>
<td>
~800Hz<br>~1600Hz<br>~3200Hz<br>~6400Hz<br>~12800Hz <br> ~25600Hz
</td>
</tr>
<tr>
<td>
sampleSize
</td>
<td>
100 - 1.000.000 arasında tamsayılar
</td>
<td>
Indicates how many samples will be taken for each axis. End devices make triaxial measurements. For example, a measurement with 1000 samples produces a total of 3000 samples.
</td>
</tr>
<tr>
<td>
objectId
</td>
<td>
https://docs.mongodb.com/manual/reference/method/ObjectId/</td>
<td>
measurement identier
</td>
</tr>
</table>

<table>

### <span style="color: rgb(240,95,34)">Topics</span>

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
<b> lake/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/measure/&lt;objectId&gt;</b>
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
 <b>   lake/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/measure/&lt;objectId&gt;/accepted</b>
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
 <b> lake/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/measure/&lt;objectId&gt;/rejected</b>
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
<b> lake/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/measure/&lt;objectId&gt;/done</b>
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
  "MEASUREMENT_START_TIME": "12:36:10:22:00:2021",
  "CALIBRATED_SAMPLINGRATE": 876
 },
 "TELEMETRY": [
  {
   "NAME": "TEMPERATURE",
   "VALUE": 29.98
  }
 ]
}
```

</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Chunk ordering and interpretation</span>

The measurements are divided into chunks and sent binary, chunkIndex is an index that counts down to 0. For example, we wanted a measurement of 10000 samples. We would see the following messages on MQTT.

> lake/gateway/CA&colon;B8&colon;28&colon;00&colon;00&colon;08/device/CA&colon;B8&colon;31&colon;00&colon;00&colon;1A/measure/098765432109876543214321 <br>
> 1,5,10000

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
  "MEASUREMENT_START_TIME": "12:36:10:22:00:2021",
  "CALIBRATED_SAMPLINGRATE": 876
 },
 "TELEMETRY": [
  {
   "NAME": "TEMPERATURE",
   "VALUE": 29.98
  }
 ]
}
```

### <span style="color: rgb(240,95,34)">Post Processing</span>

In the example above, there are 3 chunk in total, the chunk index value starts from 2 and counts to 0.
When all chunks are sent, we get the message / done with json payload. This gives us the information that chunks are ready to be interpreted.

### <span style="color: rgb(240,95,34)">Byte To Int</span>

The recorded chunk files are sorted according to chunkIndex from large to small, and all content is combined.
The aggregated content contains uint16_t little endian data. It should be interpreted correctly and cast to int values.

You could wind javascript example below

```javascript
let ordered_chunks = [chunk2, chunk1, chunk0];
let buffer = Buffer.concat(ordered_chunks);
let data = new Int16Array(Uint8Array.from(buffer).buffer);
```

### <span style="color: rgb(240,95,34)">Accelerometer Range Correction</span>

Int values must be multiplied by the correction coefficient. This changes according to the accelerometer range and is as follows. `range * 2/2 ^ 16`

<table>
 <tr>
  <th>Accelerometer Range Index</th>
  <th>Range</th>
  <th><code>range*2/2^16</code></th>
 </tr>
 <tr>
  <td>1</td>
  <td>2</td>
  <td>0.000061</td>
 </tr>
 <tr>
  <td>2</td>
  <td>4</td>
  <td>0.000122</td>
 </tr>
 <tr>
  <td>3</td>
  <td>8</td>
  <td>0.000244</td>
 </tr>
 <tr>
  <td>4</td>
  <td>16</td>
  <td>0.000488</td>
 </tr>
</table>

### <span style="color: rgb(240,95,34)">Example</span>

Let's take a measurement of 8 samples with the 2G accelerometer range.
8 -> 8 _3 = 24 total samples
Each sample is represented by int16 -> 2_ 24 -> 48 bytes

<table>
<tr>
<td>chunk2</td><td>a0 43 46 04 b7 fc f1 43 03 04 b1 fc 94 43 04 04</td>
</tr><tr>
<td>chunk1</td><td>21 04 99 fc f0 43 35 04 d5 fc a2 43 41 04 c6 fc</td></tr>
<tr>
<td>chunk0</td><td>b1 fc a8 43 60 04 a8 fc a9 43 2c 04 c3 fc b2 43</td></tr>
</table>

<table>

<tr><td>Merged Bytes</td><td>b1 fc a8 43 60 04 a8 fc a9 43 2c 04 c3 fc b2 43
21 04 99 fc f0 43 35 04 d5 fc a2 43 41 04 c6 fc
a0 43 46 04 b7 fc f1 43 03 04 b1 fc 94 43 04 04</td></tr>
<tr><td>Int16 representation</td><td> -847  17320   1120   -856  17321   1068   -829  17330
 1057   -871  17392   1077   -811  17314   1089   -826
17312   1094   -841  17393   1027   -847  17300   1028</td>
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

<br>

<br>

### <span style="color: rgb(240,95,34)">Device Firmware Update(OTA)</span>

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

<td><b>lake/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/ota</b></td>
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

<td><b>lake/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/ota/accepted</b></td>
<td><i>empty</i></td>
<td><i>empty</i></td>
<td></td>
</tr>
<tr>
<td>
Senseway
</td>

<td><b>lake/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/ota/rejected</b></td>
<td><i>Error Code</i></td>
<td><i>NO_DEVICE</i></td>
<td></td>
</tr>
<tr>
<td>
Senseway
</td>
<td><b>lake/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/ota/done</b></td>
<td><i>empty</i></td>
<td><i>empty</i></td>
<td></td>
</tr>
</table>

> Caution: A binary url should be `http` not ~`https`~

Senseway downloads the binary from given url and start firmware update for particular device.

Firmware updates led sequence of wired end nodes shown in the <a href="#/wired?id=_1wired-device-statuses-and-led-indicator">Wired documentation.</a>

### <span style="color: rgb(240,95,34)">Sleep</span>

Sensemore BLE endnodes works with battery. In order to maximize operation times of end sensors, they can be put in sleep to decrease battery consumptions and increase lifetime. Devices battery could live from 6 months to 2 years depending on the device model, measurement strategy

You can use below configuration to put devices into sleep mode for given seconds.

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

<td><b>lake/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/sleep</b></td>
<td>number</td>
<td>
<i>sleep duration in seconds</i>
</td>
<td>
2048
</td>
</tr>

</table>

> Caution: Sleep duration should be given power of 2 like 1024, 2048, 4096

Example values

<table>
<tr>

<th>
Value
</th>
<th>
Explanation
</th>
</tr>

<tr>
<th>
64
</th>
<th>
~1 minutes
</th>
</tr>

<tr>
<th>
128
</th>
<th>
~2 minutes
</th>
</tr>

<tr>
<th>
256
</th>
<th>
~4 minutes
</th>
</tr>

<tr>
<th>
512
</th>
<th>
~7.5 minutes
</th>
</tr>

<tr>
<th>
1024
</th>
<th>
~15 minutes
</th>
</tr>

<tr>
<th>
2048
</th>
<th>
~30 minutes
</th>
</tr>
<tr>
<th>
4096
</th>
<th>
~1 hour
</th>
</tr>

<tr>
<th>
8192
</th>
<th>
~2 hours
</th>
</tr>

<tr>
<th>
16384
</th>
<th>
~4.5 hours
</th>
</tr>

<tr>
<th>
32768
</th>
<th>
~9 hours
</th>
</tr>

<tr>
<th>
65536
</th>
<th>
~18 hours
</th>
</tr>
</table>

Device will disconnect after recieving sleep command and sleeps for given duration. After sleep complete device restart with a fresh session.

### <span style="color: rgb(240,95,34)">TLS</span>

Senseway devices implement TLS for a secure mqtt connection. If you manage your mqtt broker yourself, it is necessary to configure the broker's TLS and generate the required certificates.

#### <span style="color: rgb(240,95,34)">Mosquitto Configuration</span>

Referance:
<http://www.steves-internet-guide.com/mosquitto-tls/>
<https://mosquitto.org/man/mosquitto-conf-5.html>

Example configuration of `mosquitto.conf`

```
port 8883
cafile C:\mosquitto\certs\ca.crt
keyfile C:\mosquitto\certs\server.key
certfile C:\mosquitto\certs\server.crt
tls_version tlsv1.2
```

#### <span style="color: rgb(240,95,34)">Certificate Generation</span>

Referance:
<http://www.steves-internet-guide.com/creating-and-using-client-certificates-with-mqtt-and-mosquitto/>
Requirement: `openssl`

#### CA Generation

ca.key: `openssl genrsa -des3 -out ca.key 2048`

ca.crt: `openssl req -new -x509 -days 1826 -key ca.key -out ca.crt`

#### Server Certificate Generation

server.key `openssl genrsa -out server.key 2048`

server.csr `openssl req -new -out server.csr -key server.key`

> While generating a Certificate Signing Request (CSR), you should write the domain name of your broker server in the "common name" field in the form filled in. If your server does not have a domain name, you must type in the IP address directly.

Normally, for certificate generation, the CRS is sent to the CA and the CA signs the CRS and generates a valid certificate. In this example, we can generate the certificate because we are the CA.

server.crt `openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 3600`

Now `ca.crt`,`server.crt` and `server.key` can be used to configure mosquitto service with TLS support.

#### Client Certificate Generation

client.key `openssl genrsa -out client.key 2048`

client.csr `openssl req -new -out client.csr -key client.key`

> While generating a Certificate Signing Request (CSR), you should write the domain name of your broker server in the "common name" field in the form filled in. If your server does not have a domain name, you must type in the IP address directly.

client.crt `openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 360`

Now, MQTT clients (Senseway) can establish a secure connection to the mqtt server using `ca.crt`,`client.crt` and `client.key`.

### <span style="color: rgb(240,95,34)">Tips</span>

- If you are using mosquitto as a broker, you can view detailed logs by launching the application in verbose mode to solve potential problems.

- Configuration page or open the laptop to the desktop computer offers a more robust link.

- If you can manage the Wifi network, defining a static ip for the senseway can prevent DHCP-related problems that may occur in the future. (Weak modems, device networking problems).

- Storing measurement signal data in any database may cause various difficulties due to the data shape, it will be convenient to save directly in the file system.

- You should check beforehand that your wifi network is healthy and that you have access to mqtt servers.
