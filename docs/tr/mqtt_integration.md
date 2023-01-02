- [Senseway MQTT Integration](#senseway-mqtt-integration)
	- [Yapılandırma sayfasına erişim](#yapılandırma-sayfasına-erişim)
	- [MQTT Broker ve Sertifikalar](#mqtt-broker-ve-sertifikalar)
	- [NTP](#ntp)
	- [Operasyonlar](#operasyonlar)
		- [Scan](#scan)
		- [Senseway versiyonu isteme](#senseway-versiyonu-isteme)
		- [Uç cihaz version isteme](#uç-cihaz-version-isteme)
	- [Ölçüm](#ölçüm)
		- [Ölçüm Yapılandırması](#ölçüm-yapılandırması)
		- [Topicler](#topicler)
		- [Chunk sıralama ve yorumlama](#chunk-sıralama-ve-yorumlama)
		- [Post Processing](#post-processing)
		- [Byte To Int](#byte-to-int)
		- [İvme Ölçer Aralık Düzelmesi](#i̇vme-ölçer-aralık-düzelmesi)
		- [Örnek](#örnek)
	- [Sensör Yazılım Güncelleme(OTA)](#sensör-yazılım-güncellemeota)
	- [Sleep](#Sleep)
	- [TLS](#tls)
		- [Mosquitto yapılandırması](#mosquitto-yapılandırması)
		- [Sertifika Üretimi](#sertifika-üretimi)
			- [CA sertifikası oluşturma](#ca-sertifikası-oluşturma)
			- [Sunucu sertifikası oluşturma](#sunucu-sertifikası-oluşturma)
			- [İstemci Sertifikası Oluşturma](#i̇stemci-sertifikası-oluşturma)
	- [Öneriler](#öneriler)

# Senseway MQTT Integration

<img width="50" style="line-height:10px" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"></img>Örnek Python projesi [Sensemore Python Mqtt Integration](https://github.com/sensemore/sensemore-python-mqtt-client)'da bulunabilir

## Yapılandırma sayfasına erişim
Senseway güce takıldıktan kısa bir süre sonra **Senseway-CA&colon;B8&colon;XX&colon;XX&colon;XX&colon;XX** SSID'li bir wifi ağı açar. Varsayılan parola ile bu ağa bağlanılır, tarayıcıdan  [http:\\\\192.168.4.1 ](http:\\192.168.4.1) adresine gidilir.

## MQTT Broker ve Sertifikalar
Senseway MQTT/TLS yapılandırmasına ihtiyaç duyar. Kullanılacak MQTT Broker Server'in TLS desteklemesi ve senseway için gerekli sertifikaların üretilmiş olması gerekir.
- MQTT endpoint(_mqtts://my-mqtt-broker.server:8883_ )
- CA (Sertifika otoritesinin bilgisi)
- Client Cert (CA üzerinden üretilmiş ve imzalanmış sertifika)
- Client Key (CA üzerinden üretilen sertifikanın kapalı anahtarı)

Gerekli sertifikalar ve endpoint bilgisi Senseway yapılandırma sayfası aracılığı ile, `Advance > MQTT` kısmından tanımlanır. Senseway gerçekleştireceği MQTT bağlantıları için bu sertifikaları kullanır.

Detay okumakar:
https://www.hivemq.com/blog/mqtt-security-fundamentals-tls-ssl/


## NTP
_Default: http://pool.ntp.org/_ 
Senseway gönderdiği ölçüm mesajlarınada zaman  bilgisi kullanılır. Bunun için zaman senkronizasyonu ihtiyacı vardır. OnPremise kurulumlar için zaman sunucusu , `Advance > NTP` kısmından tanımlanabilir.



## Operasyonlar
Senseway ile iletişime geçereken hangi topic'lerin kullanılacağı ve mesajların nasıl yorumlanması edilmesi gerektiğni açıklar.

`Aktör`, `Topic`'e `Payload`'ı `PayloadType` formatında gönderir.

### Scan
Senseway belirli aralıklarla ona bağlı cihazlar için bir tarama başlatır. Tarama sonuçları belirli aralıklarla MQTT üzerinden yayınlanır. (1dk)

<table>
<tr>
<th>Aktör</th>
<th>Topic</th>
<th>Payload Type</th>
<th>Payload Schema</th>
<th>Example</th>
</tr>
<tr>
<td>
Senseway
</td>

<td><b>prod/gateway/&lt;SensewayID&gt;/scanDevice</b></td>

<td>json</td>
<td>

```json
{
	"<DEVICE-MAC>":{
	"type":"<DEVICE_TYPE>",
	"rssi":"<RSSI>",
	"status":"<STATUS>"
	},
	"<DEVICE-MAC2>":{
	"type":"<DEVICE_TYPE>",
	"rssi":"<RSSI>",
	"status":"<STATUS>"
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

### Senseway versiyonu isteme

<table>
<tr>
<th>Aktör</th>
<th>Topic</th>
<th>Payload Type</th>
<th>Payload Schema</th>
<th>Example</th>
</tr>
<tr>
<td>
Kullanıcı
</td>
<td>
<b> prod/gateway/&lt;SensewayID&gt;/client/SENSEWAY/version</b>
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
	<b> prod/gateway/&lt;SensewayID&gt;/client/SENSEWAY/version/accepted</b>
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


### Uç cihaz version isteme

<table>
<tr>
<th>Aktör</th>
<th>Topic</th>
<th>Payload Type</th>
<th>Payload Schema</th>
<th>Example</th>
</tr>
<tr>
<td>
Kullanıcı
</td>
<td>
<b> prod/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt/version</b>
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
	<b> prod/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt/version/accepted</b>
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
	<b> prod/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt/version/rejected</b>
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

## Ölçüm
Ölçüm alma işlemi bir yapılandırmanın uç cihaza gönderilmesi ile başlar, ardından ölçüm okuma süreci başlar. Ölçüm okuma süreci chunk'lar ile yapılır. Abone olan kullanıcının ölçüm okuma paketlerini doğru sırada yorumlayarak parse etmesi gerekmektedir.

### Ölçüm Yapılandırması
<table>
<tr>
<th>
Parametre
</th>
<th>
Alabileceği Değerler
</th>
<th>
Anlam
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
5<br> 6<br>7<br> 8<br> 9<br>10 <br>
</td>
<td>
~800Hz<br>~1600Hz<br>~3200Hz<br>~6400Hz<br>~12800Hz<br>~25600Hz
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
Her eksen için kaç örnek alınacağını belirtir. Uç cihazlar üç eksenli ölçümler yaparlar. Örneğin 1000 örnekli bir ölçüm toplamda 3000 sample üretir.
</td>
</tr>
<tr>
<td>
objectId
</td>
<td>
https://docs.mongodb.com/manual/reference/method/ObjectId/</td>
<td>
Ölçümü niteleyicisi
</td>
</tr>
</table>


<table>

### Topicler

</table>

<table>
<tr>
<th>Aktör</th>
<th>Topic</th>
<th>Payload Type</th>
<th>Payload Schema</th>
<th>Example</th>
</tr>
<tr>
<td>
Kullanıcı
</td>
<td>
<b> prod/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/measure/&lt;objectId&gt;</b>
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
	<b>   prod/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/measure/&lt;objectId&gt;/accepted</b>
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
	<b> prod/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/measure/&lt;objectId&gt;/rejected</b>
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
	<b> prod/device/&lt;DeviceMac&gt;/measure/&lt;objectId&gt;/chunk/&lt;chunkIndex&gt;</b>
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
<b> prod/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/measure/&lt;objectId&gt;/done</b>
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

### Chunk sıralama ve yorumlama
Ölçümler chunklara bölünerek binary olarak gönderilir, chunkIndex 0'a sayan bir indextir. Örneğin 10000 örneklik bir ölçüm istedik. Aşağıdaki akışı MQTT'de görecektik.
> prod/gateway/CA&colon;B8&colon;28&colon;00&colon;00&colon;08/device/CA&colon;B8&colon;31&colon;00&colon;00&colon;1A/measure/098765432109876543214321 <br>
> 1,5,10000

> prod/gateway/CA&colon;B8&colon;28&colon;00&colon;00&colon;08/device/CA&colon;B8&colon;31&colon;00&colon;00&colon;1A/measure/098765432109876543214321/accepted<br>

>prod/device/CA&colon;B8&colon;31&colon;00&colon;00&colon;1A/measure/098765432109876543214321/chunk/2<br>
> a0 43 46 04 b7 fc f1 43	03 04 b1 fc 94 43 04 04

>prod/device/CA&colon;B8&colon;31&colon;00&colon;00&colon;1A/measure/098765432109876543214321/chunk/1<br>
> 21 04 99 fc f0 43 35 04	d5 fc a2 43 41 04 c6 fc

>prod/device/CA&colon;B8&colon;31&colon;00&colon;00&colon;1A/measure/098765432109876543214321/chunk/0<br>
> b1 fc a8 43 60 04 a8 fc	a9 43 2c 04 c3 fc b2 43

>prod/gateway/CA&colon;B8&colon;28&colon;00&colon;00&colon;08/device/CA&colon;B8&colon;31&colon;00&colon;00&colon;1A/measure/098765432109876543214321/done<br>
> 
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

### Post Processing
Yukarıdaki örnekte toplamda 3 chunk geliyor, chunk Index değeri 2'den başlar ve 0'a sayar. 
Tüm chunklar gönderildiğinde ise json payload ile birlikte /done mesajını alırız. Bu bize chunkların yorumlanmaya hazır olduğu bilgisini verir. 
### Byte To Int
Kaydedilen chunk dosyaları, chunkIndex’e göre büyükten küçüğe dizerek tüm içerik birleştirilir.
Birleştirilmiş içerik uint16_t little endian verileri barındırmaktadır. Doğru yorumlanarak int değerlere cast edilmelidir. 

Aşağıda javascript ile gerçekleştirilmiş örneği bulanilirsiniz.

```javascript
  let ordered_chunks = [chunk2,chunk1,chunk0]
  let buffer = Buffer.concat(ordered_chunks);
  let data = new Int16Array(Uint8Array.from(buffer).buffer);
```

### İvme Ölçer Aralık Düzelmesi
Int değerler doğrulama kaysayısı  ile çarpılmalıdır.  Bu kaysayı ivmeölçer aralığına göre değişiklik gösterir ve aşağıdaki gibidir. `range*2/2^16`


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

### Örnek

2G ivme ölçer aralığı ile 8 örneklik bir ölçüm alalım. 
Her eksen için 8 -> 8*3 = 24 sample.
Her sample int16 ile temsil ediliyor -> 2 * 24 ->  48 byte
<table>
<tr>
<td>chunk2</td><td>a0 43 46 04 b7 fc f1 43	03 04 b1 fc 94 43 04 04</td>
</tr><tr>
<td>chunk1</td><td>21 04 99 fc f0 43 35 04	d5 fc a2 43 41 04 c6 fc</td></tr>
<tr>
<td>chunk0</td><td>b1 fc a8 43 60 04 a8 fc	a9 43 2c 04 c3 fc b2 43</td></tr>
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

## Sensör Yazılım Güncelleme(OTA)
Sensemore uç cihazların yazılımları, senseway üzerinden http ile yazım güncellemeye olanak verirler.
Başarılı bir yazılım güncelleme için, senseway tarafından erişilebilen binary dosyanın http url'i ilgili yazılım güncelleme topic'ine mesaj olarak gönderilir.

<table>
<tr>
<th>Aktör</th>
<th>Topic</th>
<th>Payload Tipi</th>
<th>Payload Şeması</th>
<th>Örnek</th>
</tr>
<tr>
<td>
User
</td>

<td><b>prod/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/ota</b></td>
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

<td><b>prod/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/ota/accepted</b></td>
<td><i>empty</i></td>
<td><i>empty</i></td>
<td></td>
</tr>
<tr>
<td>
Senseway
</td>

<td><b>prod/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/ota/rejected</b></td>
<td><i>Error Code</i></td>
<td><i>NO_DEVICE</i></td>
<td></td>
</tr>
<tr>
<td>
Senseway
</td>
<td><b>prod/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/ota/done</b></td>
<td><i>empty</i></td>
<td><i>empty</i></td>
<td></td>
</tr>
</table>

> Dikkat:  Yazılım güncelleme paketinin url'i  `http` olmalıdır  ~`https`~ değil.

Yazılım güncelleme sırasında uç sensörde görünen led sekanslarına <a href="#/tr/wired?id=_1-wired-cihaz-durumları-ve-led-göstergesi">Wired dökümantasyonundan.</a> 'dan ulaşabilirsiniz.

## Sleep

Sensemore BLE cihazları batarya ile çalışır. Uç sensörlerin çalışma sürelerini en üst düzeye çıkarmak, pil tüketimini azaltmak ve kullanım ömrünü artırmak için uyku moduna alınabilirler. Cihazların pili, cihaz modeline ve ölçüm stratejisine bağlı olarak 6 aydan 2 yıla kadar dayanabilir

Cihazları belirli saniyeler boyunca uyku moduna geçirmek için aşağıdaki yapılandırmayı kullanabilirsiniz.

<table>
<tr>
<th>Aktör</th>
<th>Topic</th>
<th>Payload Tipi</th>
<th>Payload Şema</th>
<th>Örnek</th>
</tr>
<tr>
<td>
Kullanıcı
</td>

<td><b>prod/gateway/&lt;SensewayID&gt;/device/&lt;DeviceMac&gt;/sleep</b></td>
<td>sayı</td>
<td>
<i>saniye cinsinden uyku süresi</i>
</td>
<td>
2048
</td>
</tr>

</table>

> Dikkat: Uyku süreleri 2'nin kuvveti olacak şekilde verilmelidir. Örn: 1024, 2048, 4096

Örnek  değerler

<table>
<tr>

<th>
Değer
</th>
<th>
Açıklama
</th>
</tr>


<tr>
<th>
64
</th>
<th>
~1 dakika
</th>
</tr>

<tr>
<th>
128
</th>
<th>
~2 dakika
</th>
</tr>

<tr>
<th>
256
</th>
<th>
~4 dakika
</th>
</tr>

<tr>
<th>
512
</th>
<th>
~7.5 dakika
</th>
</tr>

<tr>
<th>
1024
</th>
<th>
~15 dakika
</th>
</tr>

<tr>
<th>
2048
</th>
<th>
~30 dakika
</th>
</tr>
<tr>
<th>
4096
</th>
<th>
~1 saat
</th>
</tr>

<tr>
<th>
8192
</th>
<th>
~2 saat
</th>
</tr>


<tr>
<th>
16384
</th>
<th>
~4.5 saat
</th>
</tr>


<tr>
<th>
32768
</th>
<th>
~9 saat
</th>
</tr>


<tr>
<th>
65536
</th>
<th>
~18 saat
</th>
</tr>
</table>

Device will disconnect after recieving sleep command and sleeps for given duration. After sleep complete device restart with a fresh session.
## TLS 
Senseway cihazları güvenli bir mqtt bağlantısı için TLS uygulamaktadırlar. Eğer mqtt broker'ınızı kendiniz yönetiyorsanız, broker'ın TLS yapılandırmasının yapılması ve ilgili sertifikaların üretilmesi gerekmektedir.
### Mosquitto yapılandırması
Referans: 
http://www.steves-internet-guide.com/mosquitto-tls/
https://mosquitto.org/man/mosquitto-conf-5.html

Örnek ` mosquitto.conf`  yapılandırması

```
port 8883
cafile C:\mosquitto\certs\ca.crt
keyfile C:\mosquitto\certs\server.key
certfile C:\mosquitto\certs\server.crt
tls_version tlsv1.2
```
### Sertifika Üretimi
Referans:
http://www.steves-internet-guide.com/creating-and-using-client-certificates-with-mqtt-and-mosquitto/
Gereksinimler: `openssl` 
#### CA sertifikası oluşturma 
ca.key: `openssl genrsa -des3 -out ca.key 2048` 
ca.crt:  `openssl req -new -x509 -days 1826 -key ca.key -out ca.crt`

#### Sunucu sertifikası oluşturma
server.key `openssl genrsa -out server.key 2048`
server.csr ` openssl req -new -out server.csr -key server.key`

> Sertifika İmzalama Talebi(CSR) üretirken doldurulan formda `common name` alanını broker sunucunuzun alan adını(domain name) yazmalısınız. Eğer sunucunuzun alan adı yoksa doğrudan IP adresini yazmalısınız.

Normal şartlarda sertifika üretimi için CRS, CA'ya gönderilir ve CA CRS'i imzalar ve geçerli bir sertifika üretir. Bu örnekde CA'da biz olduğumuz için sertifikayı üretebiliriz.

server.crt `openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 3600` 

Artık `ca.crt`,`server.crt` ve `server.key` mosquitto yapılandırmasında kullanılabilir.

#### İstemci Sertifikası Oluşturma
client.key `openssl genrsa -out client.key 2048`
client.csr `openssl req -new -out client.csr -key client.key`

> Sertifika İmzalama Talebi(CSR) üretirken doldurulan formda `common name` alanını broker sunucunuzun alan adını(domain name) yazmalısınız. Eğer sunucunuzun alan adı yoksa doğrudan IP adresini yazmalısınız.

client.crt `openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 360`

Artık MQTT istemcileri(Senseway) `ca.crt`, `client.crt` ve `client.key` kullanarak mqtt sunucusuna güvenli bir bağlantı gerçekleştirebilir.


## Öneriler
- Eğer mosquitto uygulamasını broker olarak kullanıyorsanız,olası problemleri çözmek için uygulamayı verbose modda ayağa kaldırarak detaylı logları inceleyebilirsiniz.

- Yapılandırma sayfasına laptop veya masaüstü bilgisayardan açmak  daha sağlıklı bir bağlantı sunar.

- Eğer Wifi ağını yönetebiliyorsanız, senseway için statik bir ip tanımlanması ileride oluşabilecek DHCP nedenli sıkıntıların önüne geçebilir. (Zayıf modemlerde, cihaz ağa bağlanma problemleri).

- Ölçüm sinyal verilerini herhangi bir veritabanında saklamak veri şekli nedeniyle çeşitli zorluklar çıkartabilir, doğrudan dosya sisteminde kaydedilmesi uygun olacaktır.

- Wifi ağınızın sağlıklı olduğundan ve mqtt sunucularına erişimin olduğunu önceden kontrol etmelisiniz.
 