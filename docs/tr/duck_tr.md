# <span style="color: rgb(240,95,34)">Duck Entegrasyon Belgesi</span>
<img src="images/Sensemore_product_duck.gif"/>

Sensemore Duck, yalnızca titreşim, sıcaklık ve basınç değil, aynı zamanda kütle akış hızı, hız, akım gibi tüm analog verileri toplamak için kompakt bir IoT veri toplama cihazıdır.

Duck teknik özelliklerini inceleyin: _<http://sensemore.io/>_  
Duck kurulum rehberini inceleyin: _<http://sensemore.io/>_

Duck sistem entegrasyonundan bahsetmeye başlamadan önce, Duck cihazınızın MQTT, NTP ve HTTP ayarlarını yapılandırın.

### <span style="color: rgb(240,95,34)">Yapılandırma Sayfasına Erişim</span>
Duck takıldığında, kısa bir süre sonra **DUCK-CA:B8:DA:XX:XX:XX** SSID ile bir Wi-Fi erişim noktası ağı yayınlar. AP’ye bağlanmak için varsayılan şifreyi kullanın. Cihazınız, captive portalda yapılandırma sayfasına yönledricektir. Cihazınız otomatik olarak captive portalı açmazsa, varsayılan tarayıcınızda [http:\\\\192.168.4.1 ](http:\192.168.4.1) adresine gidin.  
Duck, Wi-Fi veya Ethernet üzerinden bir ağa bağlandıktan sonra, yapılandırma sayfasına aynı ağdan cihazın yerel IP adresiyle erişilebilir. Yerel IP adresi, yapılandırma sayfasının ana sekmesinde görüntülenir ve ayrıca MQTT bilgi mesajında gösterilir.

## <span style="color: rgb(240,95,34)">Bağlantı</span>

### <span style="color: rgb(240,95,34)">Wi-Fi & Ethernet</span>
Duck, ağ bağlantıları için hem Wi-Fi hem de Ethernet’i destekler. Varsayılan olarak, ağ adaptörü Wi-Fi olarak ayarlanmıştır, ancak bu ayar, Konfigürasyon sayfasının `Ayarlar > Bağlantı` bölümünde değiştirilebilir.

### <span style="color: rgb(240,95,34)">NTP</span>
Duck tarafından gönderilen ölçüm mesajlarında zaman bilgisi de kullanılır. Bunun için zaman senkronizasyonu gereklidir. Yerel veya özel kurulumlarda, Duck Konfigürasyon sayfasındaki  `Settings > NTP` bölümünden varsayılan NTP sunucusu değiştirilebilir.
_Varsayılan: <http://pool.ntp.org/>_

### <span style="color: rgb(240,95,34)">MQTT</span>
Duck, MQTT / TLS yapılandırmasına ihtiyaç duyar ve aşağıdakileri içeren çeşitli kimlik doğrulama mekanizmalarını destekler: düz metin MQTT, parola ile veya parolasız MQTTs ve istemci sertifikasıyla MQTTs. Kullanılacak MQTT Broker Sunucusu TLS’yi desteklemelidir ve sertifika tabanlı bağlantılar için aşağıdaki bilgileri sağlamalıdır:

-   MQTT endpoint (_mqtts: //my-mqtt-broker.server: 8883_)
-   CA (CA sertifikası)
-   İstemci Sertifikası (CA tarafından oluşturulan ve imzalanan sertifika)
-   İstemci Anahtarı (CA tarafından oluşturulan sertifikanın özel anahtarı)

Gerekli sertifikalar ve endpoint bilgileri, Duck konfigürasyon sayfasındaki `Settings > MQTT` bölümünde tanımlanır. Duck, gelecekteki MQTT bağlantıları için bu sertifikaları kullanır.

Detaylar
https://www.hivemq.com/blog/mqtt-security-fundamentals-tls-ssl/

### <span style="color: rgb(240,95,34)">HTTP</span>
HTTP here..

## <span style="color: rgb(240,95,34)">Duck Sensor Configuration</span>

Duck, endüstri standardı 4-20mA sensörlerle uyumludur. Duck sensör yapılandırması, sensör gruplarından oluşur. Her grup, bir ekipmanın tek bir noktasını izlemeye yöneliktir.  
- Birden fazla sensör, bir noktayı sıcaklık ve nem veya ivme ve manyetik alan gibi farklı özelliklerini izlemek için bir sensör grubuna dahil edilebilir.  
- Bir sensör, sensörün işlevselliğine bağlı olarak bir veya birden fazla giriş kanalıyla yapılandırılabilir. Örneğin, bir mesafe sensörü tek bir giriş kanalıyla yapılandırılırken, 3 eksenli bir ivme sensörü x, y, z eksenleri için üç giriş kanalıyla yapılandırılır.

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

## <span style="color: rgb(240,95,34)">MQTT Entegrasyonu</span>

Bu bölüm, Duck ile MQTT üzerinden iletişim kurarken kullanılacak konuları ve mesajların nasıl yorumlanacağını açıklar.

`Aktör` sends `Payload` with `PayloadType` format to `Topic`

### <span style="color: rgb(240,95,34)">Bilgi</span>

Duck açıldığında, cihazın temel bilgilerini içeren bir durum mesajı yayınlar. Bu mesaj, aşağıdaki konu kullanılarak da alınabilir:

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

### <span style="color: rgb(240,95,34)">Havadan Yazılım Güncellemesi (OTA)</span>

Sensemore cihazları HTTP üzerinden yazılım güncellemesini kabul eder. Cihazda yazılım güncellemesi başlatmak için, geçerli bir binary bağlantısı yazılım güncelleme konusuna gönderilir. Duck, verilen URL’den binary dosyasını indirir ve yazılım güncellemesini başlatır.

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

### <span style="color: rgb(240,95,34)">Yeniden Başlatma</span>

Duck cihazını uzaktan yeniden başlatmak için aşağıdaki konu kullanılır.

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

### <span style="color: rgb(240,95,34)">Sensör Yapılandırması</span>

Duck'ın sensör yapılandırması aşağıdaki başlıklar altında MQTT üzerinden görüntülenebilir veya değiştirilebilir.

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

:exclamation: Duck'ın sensör yapılandırmasını değiştirmek cihazın yeniden başlatılmasına neden olacaktır.

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

Duck cihazı, ölçümleri tetiklemek için birden fazla yönteme sahip olup, yüksek performanslı veri toplama için tasarlanmıştır. Cihaz, verileri sürekli olarak toplar ve aşağıdaki mekanizmalara dayalı olarak ölçümleri yayınlama koşullarını değerlendirir:
**1.	Kalp Atışı (Heartbeat):**
Belirlenen kalp atışı değerini aşan bir süre boyunca hiçbir ölçüm yayınlanmamışsa, Duck otomatik olarak bir ölçüm yayınlar.

**2.	Tetik Farkı (Trigger Difference):**
Mevcut ve önceki ölçümler arasındaki fark, yapılandırılmış yüzde eşiğini aştığında Duck bir ölçüm yayınlar. Tetik Farkı, cihazın yapılandırma ayarlarından ayarlanabilir.

**3.	Sensemore Lake:**
Kullanıcılar, Sensemore Lake platformu üzerinden manuel ölçüm isteği gönderebilir.

**4.	MQTT:**
Manuel ölçüm talepleri MQTT üzerinden de gönderilebilir. MQTT konuları hakkında detaylı bilgiler aşağıda verilmiştir.

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

## <span style="color: rgb(240,95,34)">HTTP Entegrasyonu</span>

heree.