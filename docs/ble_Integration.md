# Sensemore Infinity BLE protocol usage 

- [Sensemore Infinity BLE protocol usage](#sensemore-infinity-ble-protocol-usage)
- [Scan](#scan)
- [Connect](#connect)
- [Configuration](#configuration)
	- [Writing Sampling Rate](#writing-sampling-rate)
	- [Writing Sample Size](#writing-sample-size)
	- [Writing Accelerometer Range](#writing-accelerometer-range)
- [Measurement](#measurement)
	- [Starting Measurement](#starting-measurement)
- [Reading Measurement](#reading-measurement)
	- [Parsing payloads](#parsing-payloads)
		- [Example](#example)
	- [Reading Battery Level](#reading-battery-level)
	- [Reading Temperature](#reading-temperature)
	- [Reading Calibrated Sampling Rate](#reading-calibrated-sampling-rate)
- [Sleep](#sleep)

Sensemore Infinity is a vibration and temperature sensor which communicates with BLE protocol.
You can interact with Sensemore Infinity by using  following BLE protocol details.
When you send a measurement request to the Sensemore Infinity, it measures data and stores it into internat storage,
after that you can read data and process in your environment. Sensemore works with battery, if you want to have maximum battery life you can also sleep device for a period of time. Measurement data contains three axial accelerometer data. Data parsing will be detailed in the following sections.



# Scan
In order to connect Sensemore Infinity you should scan for BLE devices first. We try our best to keep battery life longer so 
Sensemore Infinity sends advertising packets a little less often than usual. If you cant find the device in the first scan, consider increasing scan timeout.

# Connect
Bonding is disabled in Sensemore Infinity devices.  You only need to connect to the device to take measurements. Sensemore Infinity is battery powered sensor. Staying connected for too long can cause the battery level to drop quickly. In order to increase battery life we can sleep Sensemore device. We will be discuss it the following sections.

# Configuration
Sensemore Infinity stores configuration inside and takes measurement according to the configuration.

There are three types of configuration
 - Sampling Rate
 - Samplie Size
 - Accelerometer Range

## Writing Sampling Rate
 - **Operation** Write Characteristic
 - **Characteristic** 55e9c0c3-1943-42ad-8b77-d33d1dee81e8
 - **Datatype** uint16
 - **Unit** index

 SamplingRate configuration is done by writing the Sampling Rate Index value to e6b5fbf8-00a6-4770-8888-626fb73e0ba4 characterisric. Using the frequency values could yield to incorrect results. We will discuss about calibrated sampling rate in the following sections. 

  You can also read this characteristic to learn which value is written before.

 <table>
	<tr>
		<th>Sampling Rate Index</th>
		<th>Frequency</th>
	</tr>
	<tr>
		<td>5</td>
		<td>~800Hz</td>
	</tr>
	<tr>
		<td>6</td>
		<td>~1600Hz</td>
	</tr>
    <tr>
		<td>7</td>
		<td>~3200Hz</td>
	</tr>
    <tr>
		<td>8</td>
		<td>~6400Hz</td>
	</tr>
    <tr>
		<td>9</td>
		<td>~12800Hz</td>
	</tr>
	 <tr>
		<td>10</td>
		<td>~25600Hz</td>
	</tr>
</table>


## Writing Sample Size
 - **Operation** Write Characteristic
 - **Characteristic** 2a690bfd-9b2c-4011-875c-8be2637c8f0b
 - **Datatype** uint32
 - **Unit** number of samples


 Sample Size configuration is done by writing the number of samples to 2a690bfd-9b2c-4011-875c-8be2637c8f0b characterisric. Sensemore Infinity will be using this value to stop measuring. Measurement time will vary according to the configuration of sample size and sampling rate. 
 
 Although Sensemore Infinity could measure up to 500K sample it is not advised to use because transmitting the measurement data could take up to half hour.

 You can also read this characteristic to learn which value is written before.

## Writing Accelerometer Range
 - **Operation** Write Characteristic
 - **Characteristic** e6b5fbf8-00a6-4770-8888-626fb73e0ba4
 - **Datatype** uint8
 - **Unit** index

 Accelerometer configuration is done by writing the Accelerometer Range Index value to e6b5fbf8-00a6-4770-8888-626fb73e0ba4 characterisric. Using the range value will be discussed in the measurement section.

 You can also read this characteristic to learn which value is written before.
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

# Measurement


After writing neccessary configuration values, device will be ready to take measurements. 

Taking a measurements consist of two steps. Starting a measurement and reading the measurement. Sensemore Infinity stores data into its internal flash while measuring. 

You do not have to configure device for each measurement. 
Sensemore Infinity will use the previous configuration values to take measurements. You can also read back the configuration values and the data anytime you want.

## Starting Measurement
 - **Operation** Indication
 - **Characteristic** e6b5fbf8-00a6-4770-8888-626fb73e0ba4


You can start a measurement when every you want. Sensemore Infinity will be using the configuration stored inside. When you start an indication to characteristic e6b5fbf8-00a6-4770-8888-626fb73e0ba4 Sensemore Infinity first remove neccessary space in the internalflash then starts sampling the data and storing into its internal flash
After measurement is done successfully, Sensemore Infinity sends a random byte through indication then indication can be closed safely.

# Reading Measurement
 - **Operation** Indication
 - **Characteristic** 552bfd36-8a69-42d1-b6ce-e1c0ea2137ef
 - **DataType** int16 array 

If sensor is idle you can start reading anytime you want. You can handle payloads and interpret as int16 array, after receiving all payloads you can safely close the indication. 

## Parsing payloads
Each payload consist of three axial samples and each samples data type is int16. It has the following representation.

Representation of the measurement package via accelerometer axis data:

| X1 | Y1 | Z1 | X2 | Y2 | Z2 | ... | X40 | Y40 | Z40 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2byte | 2byte | 2byte | 2byte | 2byte | 2byte | ... | 2byte | 2byte | 2byte |


### Example

Let's take a measurement of 8 samples with the 2G accelerometer range.<br>
The correction coefficient of 2G is 0.000061<br>
8 -> 8 * 3(for each axis) = 24 total samples<br>
Each sample is represented by int16 -> 2 * 24 -> 48 bytes
for the sake of simplicity we assume each ble payload is 32 bytes. 
Then you now you can close the indication after receiving 32 bytes.
You can parse the payloads while reading the indication also. In this examples, we assume that we collect data and store into a buffer then process it later.

Here is the ble payloads.
<table>
<tr>
<td>payload0</td><td>b1 fc a8 43 60 04 a8 fc	a9 43 2c 04 c3 fc b2 43</td>
</tr>
<tr>
<td>payload1</td><td>21 04 99 fc f0 43 35 04	d5 fc a2 43 41 04 c6 fc</td>
</tr>
<tr>
<td>payload2</td><td>a0 43 46 04 b7 fc f1 43	03 04 b1 fc 94 43 04 04</td>
</tr>
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

You can use following java code to parse bytes[2] to int16

	((bytes[1] << 0) & 0x00ff | (bytes[0] << 8) & 0x7f00);

<hr>


## Reading Battery Level
 - **Operation** Read Characteristic
 - **Characteristic** 191341a6-3640-4dd7-9705-d7d02268ba81
 - **Datatype** uint16
 - **Unit** mV
 In order to calculate voltage value, you should divide the result by 1000 

## Reading Temperature 
 - **Operation** Read Characteristic
 - **Characteristic** 14afd82c-6a1c-4eb5-ab73-ea2afc64153b
 - **Datatype** uint16
 - **Unit**  1000 * Celcius
 
 In order to calculate celcius value, you should divide the result by 1000 

## Reading Calibrated Sampling Rate 
 - **Operation** Read Characteristic
 - **Characteristic** 2c15e29a-0630-420f-a409-ad569b943068"
 - **Datatype** uint32
 - **Unit** Hz
 
 Sensemore Infinity calculates calibrated sampling rate on the fly, after each measurement you should ask for last calibrated sampling rate and use it for further calculations.

# Sleep
 - **Operation** Write Characteristic
 - **Characteristic** f3b67640-58f3-436f-a8a8-240400eed98f
 - **Datatype** uint32
 - **Unit** Seconds
 - 
The Sensemore Infinity battery offers up to a week of battery life without being put to sleep under normal conditions. For long-lasting use, the Sensemore Infinity device can be put to sleep when it is not taking measurements, and the battery life can be increased up to 6 months.

For t he sake of the optimisation sleep durations should be power of two. If you use different value it ceil value to the next power of two.


You can find valid values imn the tables below

<table>

</tr><td>Seconds</td><td>		Minutes</td><td>	Hours</td></tr>
</tr><td>4</td><td>		0.066666666666667</td><td>	0.001111111111111</td></tr>
</tr><td>8</td><td>		0.133333333333333</td><td>	0.002222222222222</td></tr>
</tr><td>16</td><td>		0.266666666666667</td><td>	0.004444444444444</td></tr>
</tr><td>32</td><td>		0.533333333333333</td><td>	0.008888888888889</td></tr>
</tr><td>64</td><td>		1.06666666666667</td><td>	0.017777777777778</td></tr>
</tr><td>128</td><td>		2.13333333333333</td><td>	0.035555555555556</td></tr>
</tr><td>256</td><td>		4.26666666666667</td><td>	0.071111111111111</td></tr>
</tr><td>512</td><td>		8.53333333333333</td><td>	0.142222222222222</td></tr>
</tr><td>1024</td><td>	17.0666666666667</td><td>	0.284444444444444</td></tr>
</tr><td>2048</td><td>	34.1333333333333</td><td>	0.568888888888889</td></tr>
</tr><td>4096</td><td>	68.2666666666667</td><td>	1.13777777777778</td></tr>
</tr><td>8192</td><td>	136.533333333333</td><td>	2.27555555555556</td></tr>
</tr><td>16384</td><td>	273.066666666667</td><td>	4.55111111111111</td></tr>
</tr><td>32768</td><td>	546.133333333333</td><td>	9.10222222222222</td></tr>
</tr><td>65536</td><td>	1092.26666666667</td><td>	18.2044444444444</td></tr>
</tr><td>131072</td><td>	2184.53333333333</td><td>	36.4088888888889</td></tr>
</table>