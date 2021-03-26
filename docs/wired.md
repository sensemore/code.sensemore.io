# **Wired v1.0.8**
Wired User Manual
##  1.Wired device statuses and LED indicator

The operating status of the Wired device can be followed by the LED indicator.

The device's light can blink short or long.
Short: LED 250 ms on, 250 ms off

Long: LED 1000 ms on, 250 ms off.

Table 1: Wired LED indicator and the current status of the device

| **LED duration** | **LED color** | **LED status** | **Device status** |
| --- | --- | --- | --- |
| 1 second | Yellow | Solid | The device is initializing |
| 6 times | Yellow | Short | The device is getting ready before initializing the application |
| Idle | Green | Solid | Waiting for command |
| During the deletion process | Blue | Solid | Previous measurement in the memory is being reset |
| From the end of the measurement to the start | White | Blinking | Taking measurement |
| Until measurement data is sent | Purple | Blinking | Sending measurement data |
| 1 minute | Light blue | Solid | Waiting for message in firmware update mode |
| During the update message | Yellow | Blinking | Message received in firmware update mode |
| 3 times | Green | Short | Update message is received successfully |
| 1 time | Red | Long | Error occurred during the update message |
| 3 times | Red | Long | No message received in firmware update mode within 1 minute |
| 1 second | Purple | Solid | Update started |
| Until the new update is installed on the device | Purple | Blinking | Update data is being installed on the device |
| 3 times | Green | Short | Update completed successfully |
| Number of repetitions returns error code | Red | Long | Problem occurred during update |
| 5 times | Red | Long | Last 5 update attempts failed |

## 2. Wired Communication Protocol

The communication protocol used in Wired devices is as below. The data receiving and sending protocol uses the UART - RS485 protocol.In this version of the device, the UART baud rate is set to 115200. The starting and ending number must be kept constant in the data protocol. The message type that is reserved as 2-bit must also stay constant as 0b00. All messages sent must be packaged as shown below. The decoding of the received messages must also be done likewise.

![Figure 1 : Communication protocol](/images/smcom_wired_protocol-en.svg)

The data size area is represented by one byte. Therefore, the data size can be a maximum of 255.

The address field must be one byte in total, 4-bit receiver and 4-bit transmitter.As Wired devices can be found more than once in a network, a command can only be sent to the desired device by specifying the address of that device in the address field.If the recipient address is 15 (0x0F) in the message packet that is sent, all devices on the network can receive the message.The address that is kept by the device is a numerical value assigned afterwards and it may be changed on demand.The device starts listening to address 14 (0x0E) every time it is initialized.

Any desired value can be entered as the sender address.However, Wired devices always set the recipient address as 13(0x0D) and send a message. For this reason, it is appropriate to use the address 13 as the sender address.

The message index is reserved by predetermined message types.Only the message indices between the range of 0x0A - 0x13 (11 - 19) are reserved for the user.The remaining values are kept for other processes and should not be used.

The transferred data must be sent in compression between the starting and ending series of the packet. Because the data size of the packet headers is predetermined, determining the data length is crucial for checking the end of the packet.

The CRC calculation is done beginning from the starting number to the last byte of data.Only the two bytes of the CRC data and the 0xBF ending number at the end of the packet are not included in the CRC calculation.The algorithm that is used in CRC is explained in the section named Error Detection (CRC) Check.

## 3. Message (Command) types

Message types allow Wired devices to perform predetermined processes. They are located next to the message index command names in the starting series of the protocol, which is described earlier.For a trouble-free communication with the device, the messages have to be sent in the proper format and the responses should be processed in the designated format.

Some message contents contain a message status variable. This variable takes the values in the table given below and is used by Wired to understand the status of received responses.

Table 2: Status variable in messages

| **Message status** | **Message code** |
| --- | --- |
| Failure | 0x00 |
| Success | 0x01 |
| Time out | 0x02 |
| Data | 0x03 |
| Wrong message type | 0x04 |
| Corrupted packet | 0x05 |

### 3.0 Reading the device version (0x0A)

In order to read the version of the device, a null message is sent to the 0x0A message index.

Table 3: Message format sent to read the version

| **Null message** |
| --- |
| 0 byte |

The message expected from the device in response to this is in the following format:

Table 4: Message format received to read the version

| **Major** | **Minor** | **Patch** |
| --- | --- | --- |
| 1 byte | 1 byte | 1 byte |

### 3.1 Reading the device MAC address (0x0B)

If 5 zeros are sent to the device as data with the 0x0B message index, the device sends the 6-byte MAC address on it in response. Sending data other than zero may change the configuration of the device, causing the message to arrive late. This area is reserved for later use.

Table 5: Message format sent to read the MAC address

| **Data reserved for device configuration** |
| --- |
| 5 byte - (00000) |

Table 6: Message format received to read the MAC address

| **MAC address** |
| --- |
| 6 byte |


### 3.2 Assigning an address to the device for communication (0x0C)

When Wired devices initialize, they register to address 14 and start listening to this address. If working with a Wired device, 14 can be used as the recipient address.

 However, if more than one Wired device is on the same line, an address must be assigned. Hence, the message content must contain the Wired MAC address and the assigned address. The maximum number of Wired devices permitted on a line is limited to 11. For this reason, addresses that can be assigned have to be in the range 0-11.

Table 7: Message format sent for address assignment

| **Assigned address** | **MAC address** |
| --- | --- |
| 1 byte | 6 byte |

No response is given to this message.For the next message, the device now starts listening to the given address. No address assignment can be made if the MAC address is wrong. The device continues to communicate from the previous address.

Table 8: Message format expected for address assignment

| **No response given** |
| --- |
| - |

### 3.3 Initializing the measurement (0x0D)

The message index is set to 0x0D for the device to initialize the measurement. The message format sent should be as follows.

Table 9: Message format sent to initialize the measurement

| Accelerometer index | Frequency index | Sampling size |  Reporting the end of the measurement |
| --- | --- | --- | --- |
| 1 byte | 1 byte | 4 byte (Little Endian) | 1 byte |

- Accelerometer range: The acceleration range assigned for accelerometer scaling is indicated as accelerometer index and ranges in Table 10.
- Frequency index: The frequency index assigned for the sampling frequency is indicated as indices and values in Table 11.
- Sampling size: The maximum sample size that the device can keep at a time is 1,369,429 samples.
- Reporting the end of the measurement: If 1 is sent, the device returns to the end of the measurement with the same message index. This response includes whether the measurement is ended successfully or not.If 0 is sent, the measurement is taken and the device continues its regular operation.When the measurement result will be obtained should be calculated by the user.

Table 10: Accelerometer index and corresponding range

| Accelerometer index | Accelerometer range |
| --- | --- |
| 0x01 | ±2 g |
| 0x02 | ±4 g |
| 0x03 | ±8 g |
| 0x04 | ±16 g |

Table 11: Frequency index and corresponding frequency value

| Frequency index | Frequency value |
| --- | --- |
| 0x05 | 800 Hz |
| 0x06 | 1600 Hz |
| 0x07 | 3200 Hz |
| 0x08 | 6400 Hz |
| 0x09 | 12800 Hz |

If a response is requested at the end of the measurement, the device sends the status codes previously specified. The size of the data length is one byte.

Table 12: Message format expected to initialize the measurement (If 1 is sent)

| Measurement status |
| --- |
| 1 byte |

For example, the message data to be sent to initiate a measurement with the following configurations should be:

Table 13: Measurement configuration example

| Accelerometer index | Frequency index |Sampling size | Reporting the end of the measurement |
| --- | --- | --- | --- |
| 3 | 6 | 10000 | 1 |

The sampling size should be described in the message as _Little Endian_.In other words, leastsignificant bits should be in the first part of the data and the most significant bit should be in the last part of the data. The 4-byte array representation of the number 10000 is given in Table 14. The desired sampling size should be converted into a byte array as in the example.

Table 14: Data format prepared for the measurement configuration example (in hexadecimal [Base-16])

| Accelerometer index [7:0] | Frequency index[7:0] | Sampling size[7:0] | Reporting the end of the measurement[7:0] |
| --- | --- | --- | --- |
| 0x03 | 0x06 |<table>  <thead>  <tr>  <th>[7:0]</th> <th> [15:8]</th><th>[23:16]</th><th>[31:24]</th></tr></thread><tbody><td>0x10</td><td>0x27</td><td>0x0</td><td>0x0</td></tbody></table> | 0x01 |

Together with the communication protocol, the message prepared above is shown in 14 bytes in total and should take the following form:

Table 15: Message package to be prepared in the measurement configuration example (in base-10)

| 251 | 7 | 222 | 52 | 3 | 6 | 16 | 39 | 0 | 0 | 1 | 137 | 231 | 191 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

### 3.4 Reading the measurement (0x0E)

If the device is not busy, the last measurement in the memory can be read at any time. A null message is sent to the measurement read command.

Table 16: Message format sent to read the measurement

| Null message |
| --- |
| 0 byte |

The Wired device sends messages in different formats in response to this message. However, all messages return with the 0x0E message index.

Table 17: Message format that is expected if measurement reading is successful

| Message status | Measurement size | Measurement data |
| --- | --- | --- |
| 1 byte (0x03) | 1 byte | 6 bytes - 240 bytes (_Little Endian_ - signed) |

Measurement data format can be a minimum of 6 bytes and a maximum of 240 bytes. Each sample consists of 6 bytes of data. In 16-bit integer format, the X-axis is sent first, then the Y-axis, and finally the Z-axis is sent (15th bit represents the sign bit). The 16-bit integer is written in two Little Endian formats as 8-bit. In this way, a minimum of 1 sample and a maximum of 40 samples can be read in a message packet.

Table 18: Representation of a measurement data as a byte array

| X1 | X1 | Y1 | Y1 | Z1 | Z1 |
| --- | --- | --- | --- | --- | --- |
| X[7:0] | X[15:8]| Y[7:0] | Y[15:8] | Z[7:0] | Z[15:8]
| 1 byte | 1 byte | 1 byte | 1byte | 1 byte | 1 byte

Each instance is represented as Little Endian in the figure above.

A 240-byte measurement data is divided into samples as follows:

3 (axis) \* 2 (16-bit integer) \* 40 samples = 240 bytes

Table 19: Representation of the measurement package via accelerometer axis data:

| X1 | Y1 | Z1 | X2 | Y2 | Z2 | ... | X40 | Y40 | Z40 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2byte | 2byte | 2byte | 2byte | 2byte | 2byte | ... | 2byte | 2byte | 2byte |

If the receiving party does not know the measurement size,they can find the sampling size of the last measurement in the device by dividing the total size of the packets by six by looking at the measurement size (in the byte format) in the received messages.While sending measurement data, the message status is shown with the data status represented in Table 1 and its value becomes 0x03.

After the last measurement packet is sent, the Wired device changes the message status to the same message index and sends the calibration frequency and the temperature measured by the device. The message format is as follows:

Table 20: Expected message format if measurement reading is completed successfully

| Message status | Calibration frequency | Temperature |
| --- | --- | --- |
| 1 byte (0x01) | 4 bytes (_Little Endian_ – not signed) | 2 bytes (_Little Endian -_ signed) |

If there is any error occurred during reading the measurement;

Table 21: If an error occurred during reading the measurement

| Message status | Error code |
| --- | --- |
| 1 byte (0x00) | 1 byte |

Table 22: Errors that may occur during reading the measurement and their codes

| Error condition | Error code |
| --- | --- |
| No measurement | 0x00 |
| Corrupted measurement packets | 0x01 |
| Time out | 0x02 |

### 3.5 Reading the clearance (0x0F)

Only the message index should be 0x0F and data size that is sent has to be zero.

Table 23: Message format sent for clearance

| Null message |
| --- |
| 0 byte |

Table 24: Expected message format to read the clearance

| Clearance-X | Clearance-Y | Clearance-Z |
| --- | --- | --- |
| 8 byte (IEEE-754 double) | 8 byte (IEEE-754 double) | 8 byte (IEEE-754 double) |

### 3.6 Reading the crest (0x10)

Only the message index should be 0x10 and data size that is sent has to be zero.

Table 25: Message format sent to read the crest

| Null message |
| --- |
| 0 byte |

Table 26: Expected message format to read the crest

| Crest-X | Crest-Y | Crest-Z |
| --- | --- | --- |
| 8 byte (IEEE-754 double) | 8 byte (IEEE-754 double) | 8 byte (IEEE-754 double) |

### 3.7 Reading the GRMS (0x11)

Only the message index should be 0x11 and data size that is sent has to be zero.

Table 27: GRMS Message format sent to read the GRMS

| Null message |
| --- |
| 0 byte |

Table 28: Expected message format to read the GRMS

| GRMS-X | GRMS-Y | GRMS-Z |
| --- | --- | --- |
| 8 byte (IEEE-754 double) | 8 byte (IEEE-754 double) | 8 byte (IEEE-754 double) |

###

### 3.8 Reading the kurtosis (0x12)

Only the message index should be 0x12 and data size that is sent has to be zero.

Table 29: Message format sent to read the kurtosis

| Null message |
| --- |
| 0 byte |

Table 30: Expected message format to read the kurtosis

| Kurtosis-X | Kurtosis-Y | Kurtosis-Z |
| --- | --- | --- |
| 8 byte (IEEE-754 double) | 8 byte (IEEE-754 double) | 8 byte (IEEE-754 double) |

### 3.9 Reading the skewness (0x13)

Only the message index should be 0x13 and data size that is sent has to be zero.

Table 31: Message format sent to read the skewness

| Null message |
| --- |
| 0 byte |

Table 32: Expected message format to read the skewness

| Skewness-X | Skewness-Y | Skewness-Z |
| --- | --- | --- |
| 8 byte (IEEE-754 double) | 8 byte (IEEE-754 double) | 8 byte (IEEE-754 double) |

### 3.10 Reading the measurement - Chunk-wise (0x14)

If the device is not busy, the last measurement in the memory can be read at any time. This reading type differs from section 3.4 and requires byte offset and read amount in message. In order to read desired amount of bytes, measurement sample size must be known beforehand to arrange byte offset value. For the first measurement, chunk byte offset starts from 0. After the first read, read amount of first read should be added to the byte offset. In this way, the whole measurement can be read if the receiver side handles this procedure. Any desired packet can be read any time, there is no time obligation between read operations.

Table 33: Message format sent to read the measurement

| Byte offset | Read amount |
| --- | --- | 
| 4 bytes (_Little Endian_) | 4 bytes (_Little Endian_) |


Table 34: Message format that is expected if measurement reading is successful

| Message status | Measurement size | Measurement data |
| --- | --- | --- |
| 1 byte (0x03) | 1 byte | 6 bytes - 240 bytes (_Little Endian_ - signed) |

Measurement data format can be a minimum of 6 bytes and a maximum of 240 bytes. Each sample consists of 6 bytes of data. In 16-bit integer format, the X-axis is sent first, then the Y-axis, and finally the Z-axis is sent (15th bit represents the sign bit). The 16-bit integer is written in two Little Endian formats as 8-bit. In this way, a minimum of 1 sample and a maximum of 40 samples can be read in a message packet.

Table 35: Representation of a measurement data as a byte array

| X1 | X1 | Y1 | Y1 | Z1 | Z1 |
| --- | --- | --- | --- | --- | --- |
| X[7:0] | X[15:8]| Y[7:0] | Y[15:8] | Z[7:0] | Z[15:8]
| 1 byte | 1 byte | 1 byte | 1byte | 1 byte | 1 byte

Each instance is represented as Little Endian in the figure above.

A 240-byte measurement data is divided into samples as follows:

3 (axis) \* 2 (16-bit integer) \* 40 samples = 240 bytes

Table 36: Representation of the measurement package via accelerometer axis data:

| X1 | Y1 | Z1 | X2 | Y2 | Z2 | ... | X40 | Y40 | Z40 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2byte | 2byte | 2byte | 2byte | 2byte | 2byte | ... | 2byte | 2byte | 2byte |

If there is any error occurred during reading the measurement;

Table 37: If an error occurred during reading the measurement

| Message status | Error code |
| --- | --- |
| 1 byte (0x00) | 1 byte |

Table 38: Errors that may occur during reading the measurement and their codes

| Error condition | Error code |
| --- | --- |
| No measurement | 0x00 |
| Corrupted measurement packets | 0x01 |
| Time out | 0x02 |


### 3.11 Reading the telemetry values (0x16)

For the last measurement (if device is not powered off) telemetry values can be read any time. 

Only the message index should be 0x16 and data size that is sent has to be zero.

Table 39: Telemetry Message format sent to read the all telemetry

| Null message |
| --- |
| 0 byte |



Table 40: Expected message format for the response

|Message status | TEMPERATURE | SAMPLING RATE | CLEARANCE-[X,Y,Z]| CREST-[X,Y,Z] | GRMS-[X,Y,Z] | KURTOSIS-[X,Y,Z] | SKEWNESS-[X,Y,Z] |
| --- | --- | --- | ---| --- | --- | --- | --- |
| 1 byte | 2 bytes(_Little Endian_) | 4 bytes (_Little Endian_) | double | double | double | double | double |

- Message status indicates the read operation status
- Temperature value must be divided by 100.0 to convert it to float value
- All double telemetry data satisfy the IEEE-754 double format and [X,Y,Z] represents double array



## 4. Error Detection (CRC) Check

The CRC-16 algorithm is preferred for the CRC calculation used in the communication protocol. The CRC sample code that is calculated for one byte of data is below.

The CRC polynomial is represented by x^16 + x^15 + x^2 + 1, POLY\_IBM. The CRC variable must first start with CRC\_IBM\_SEED (0xFFFF) and each calculated CRC value must be given as a parameter to the represented function for the next byte.
```cpp
//Polynomial x^16 + x^15 + x^2 + 1
#define POLY_IBM 0x8005 //'0b1000000000000101'
#define CRC_IBM_SEED 0xffff //Start with this seed
 
uint16_t compute_crc_ibm(uint16_t crc, uint8_t data){
   for (uint8_t i = 0; i < 8; ++i){
       uint8_t b = ((crc & 0x8000) >> 8);
       crc <<= 1; // shift left once
       if( (b^(data & 0x80)) != 0){
           crc ^= POLY_IBM; //xor with polynomial
       }
       data<<=1; // shift data to get next bit
   }
   return crc;
}

```
Figure 2: The CRC sample code for one byte of data.

## 5. Cable connections

Cable connections and the color codes


![Figure 3: RS485 cable connections](/images/wired_rs485_cable.svg)

Figure 3: RS485 cable pinout (for closed ended cables)


Table 41: Cable colors and connections inside the black shield (for open ended cables)

| Color | Cable name |
| --- | --- |
| Thick black (tubular) | GND (Shield) |
| Thin black | VCC (5-36V) |
| White | A |
| Red | B |


