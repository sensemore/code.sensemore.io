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

Duck tarafından gönderilen ölçüm mesajlarında zaman bilgisi de kullanılır. Bunun için zaman senkronizasyonu gereklidir. Yerel veya özel kurulumlarda, Duck Konfigürasyon sayfasındaki `Settings > NTP` bölümünden varsayılan NTP sunucusu değiştirilebilir.
_Varsayılan: <http://pool.ntp.org/>_

### <span style="color: rgb(240,95,34)">MQTT</span>

Duck, MQTT / TLS yapılandırmasına ihtiyaç duyar ve aşağıdakileri içeren çeşitli kimlik doğrulama mekanizmalarını destekler: düz metin MQTT, parola ile veya parolasız MQTTs ve istemci sertifikasıyla MQTTs. Kullanılacak MQTT Broker Sunucusu TLS’yi desteklemelidir ve sertifika tabanlı bağlantılar için aşağıdaki bilgileri sağlamalıdır:

- MQTT endpoint (_mqtts: //my-mqtt-broker.server: 8883_)
- CA (CA sertifikası)
- İstemci Sertifikası (CA tarafından oluşturulan ve imzalanan sertifika)
- İstemci Anahtarı (CA tarafından oluşturulan sertifikanın özel anahtarı)

Gerekli sertifikalar ve endpoint bilgileri, Duck konfigürasyon sayfasındaki `Settings > MQTT` bölümünde tanımlanır. Duck, gelecekteki MQTT bağlantıları için bu sertifikaları kullanır.

Detaylar
https://www.hivemq.com/blog/mqtt-security-fundamentals-tls-ssl/

### <span style="color: rgb(240,95,34)">HTTP</span>

Duck, HTTP üzerinden kontrol edilebilir, bu da bağlı cihazlar üzerinde yapılandırma değişiklikleri ve ölçüm işlemleri yapmayı sağlar. HTTP uç noktalarına erişim, önce bir giriş yapmayı gerektirir, ardından alınan belirteç, sonraki iletişimlerde kullanılmalıdır. HTTP uç noktaları hakkında detaylı bilgi, Duck Yapılandırma Web Sayfası tarafından kullanılanlar dahil, HTTP Entegrasyon bölümünde mevcuttur.

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
          "channels": [0, 1, 2],
          "channel_codes": [
            "accelerometer_x",
            "accelerometer_y",
            "accelerometer_z"
          ],
          "min_max_voltage": [-5, 5],
          "min_max_value": [-1000, 1000],
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
          "channels": [0, 1, 2],
          "channel_codes": [
            "accelerometer_x",
            "accelerometer_y",
            "accelerometer_z"
          ],
          "min_max_voltage": [-5, 5],
          "min_max_value": [-1000, 1000],
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
  "url": "http://link.mydomain.com/Duck.bin"
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

```json
{
  "heartbeat_interval_min": 98,
  "sensor_groups": [
    {
      "sensor_group_code": "fe1e2714-5ac0-404c-9eb1-20f3a1d2a214",
      "sensors": [
        {
          "sensor": "accelerometer",
          "channels": [0],
          "channel_codes": ["accelerometer_x"],
          "min_max_voltage": [-5, 5],
          "min_max_value": [-1000, 1000],
          "trigger_differancel_rate": 2
        }
      ]
    }
  ]
}
```

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

```json
{
  "heartbeat_interval_min": 15,
  "sensor_groups": [
    {
      "sensor_group_code": "fe1e2714-5ac0-404c-9eb1-20f3a1d2a214",
      "sensors": [
        {
          "sensor": "accelerometer",
          "channels": [0],
          "channel_codes": ["accelerometer_x"],
          "min_max_voltage": [-5, 5],
          "min_max_value": [-1000, 1000],
          "trigger_differancel_rate": 2
        }
      ]
    }
  ]
}
```

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
  <i>

```json
{
  "status": "OK, device will be restarted"
}
```

<i>
	</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Measuremnt</span>

Duck cihazı, ölçümleri tetiklemek için birden fazla yönteme sahip olup, yüksek performanslı veri toplama için tasarlanmıştır. Cihaz, verileri sürekli olarak toplar ve aşağıdaki mekanizmalara dayalı olarak ölçümleri yayınlama koşullarını değerlendirir:
**1. Kalp Atışı (Heartbeat):**
Belirlenen kalp atışı değerini aşan bir süre boyunca hiçbir ölçüm yayınlanmamışsa, Duck otomatik olarak bir ölçüm yayınlar.

**2. Tetik Farkı (Trigger Difference):**
Mevcut ve önceki ölçümler arasındaki fark, yapılandırılmış yüzde eşiğini aştığında Duck bir ölçüm yayınlar. Tetik Farkı, cihazın yapılandırma ayarlarından ayarlanabilir.

**3. Sensemore Lake:**
Kullanıcılar, Sensemore Lake platformu üzerinden manuel ölçüm isteği gönderebilir.

**4. MQTT:**
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
  <i>

```json
{
  "status": "initiated"
}
```

<i>
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
    <i>

```json
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
            "channels": [0],
            "channel_codes": ["accelerometer_x"],
            "min_max_voltage": [-5, 5],
            "min_max_value": [-1000, 1000],
            "trigger_differancel_rate": 2
          }
        ]
      }
    ]
  }
}
```

<i>
	</td>
</tr>
</tr>
</table>

## <span style="color: rgb(240,95,34)">HTTP Entegrasyonu</span>

Duck ve bağlı cihazlarının ayarlarını görüntülemek veya değiştirmek için kapsamlı HTTP uç noktaları bulunur.

Bazı uç noktalar, başlıkta bir kimlik doğrulama tokenı gerektirir. Kimlik doğrulama tokını gerektiren uç noktalar, 🔐 simgesiyle işaretlenmiştir.
Bu tokını, aşağıda gösterildiği gibi **Giriş** uç noktası kullanılarak elde edilir:

### <span style="color: rgb(240,95,34)">Giriş</span>

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Content-Type</th>
<th>Example</th>
</tr>
<tr>
<td>
POST
</td>
<td>
<b> /login</b>
</td>
<td>
application/json
</td>
<td>
<i>

```json
{
  "password": "<DEFAULT_PASSWORD>"
}
```

</i>
</td>
</tr>
<tr>
 <td>
 GET
 </td>
 <td>
 <b> /login</b>
 </td>
 <td>
 application/json
 </td>
 <td>
 <i>

```json
{
  "token": "CLjziyTeTzlMsv100mvgkxnTQl1nGYXpQvsIStAW16WrMjxzLvhNTOGhcFFzU38mT8sHKFhxBOm3309qxSmzKIHJux3rUbjVTkywmayA1O05hKaQn9jlY99YMmp1NorF"
}
```

 </i>
 </td>
</tr>
</table>

#### <span style="color: rgb(240,95,34)">Tokenını başlığa ekle</span>

Kimlik doğrulama tokenı Giriş uç noktası aracılığıyla alındıktan sonra, her HTTP isteğinde 🔐 uç noktaları için başlığa eklenmesi gerekir, aşağıda gösterildiği gibi.

```json
{
  "Authorization": "CLjziyTeTzlMsv100mvgkxnTQl1nGYXpQvsIStAW16WrMjxzLvhNTOGhcFFzU38mT8sHKFhxBOm3309qxSmzKIHJux3rUbjVTkywmayA1O05hKaQn9jlY99YMmp1NorF"
}
```

### <span style="color: rgb(240,95,34)">Çıkış</span>

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Content-Type</th>
<th>Example</th>
</tr>
<tr>
<td>
POST
</td>
<td>
<b> /logout</b>
</td>
<td>
application/json
</td>
<td>
<i>
</i>
</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Information</span>

Cihaz hakkında temel bilgiler, **Donanım Yazılımı Sürümü** dahil, aşağıdaki HTTP uç noktası kullanılarak alınabilir:

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Content-Type</th>
<th>Example</th>
</tr>
<tr>
<td>
GET
</td>
<td>
<b> /info</b>
</td>
<td>
application/json
</td>
<td>
<i>

```json
{
  "mac_address": "CA:B8:DA:XX:XX:XX",
  "version": "3.0.0",
  "is_network_connected": true,
  "is_internet_connected": true
}
```

</i>
</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">🔐 Şifre Değisimi</span>

Cihazın HTTP ve web yapılandırma arayüzü şifresi, aşağıdaki HTTP uç noktası kullanılarak değiştirilebilirç

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Content-Type</th>
<th>Example</th>
</tr>
<tr>
<td>
PUT
</td>
<td>
<b> /change_password</b>
</td>
<td>
application/json
</td>
<td>
<i>

```json
{
  "old_password": "<DEAFULT_PASSWORD>",
  "new_password": "12345678"
}
```

</i>
</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">🔐 NTP</span>

Zaman bilgisi, Duck tarafından gönderilen ölçüm mesajlarının bir parçasıdır. NTP yapılandırması, aşağıdaki HTTP uç noktası kullanılarak alınabilir veya değiştirilebilir.

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Content-Type</th>
<th>Example</th>
</tr>
<tr>
<td>
GET
</td>
<td>
<b> /sntp</b>
</td>
<td>
application/json
</td>
<td>
<i>

```json
{
  "sntp_server": "http://pool.ntp.org/"
}
```

</i>
</td>
</tr>
<tr>
 <td>
 POST
 </td>
 <td>
 <b>/sntp</b>
 </td>
 <td>
 application/json
 </td>
 <td>
 <i>

```json
{
  "sntp_server": "http://pool.ntp.org/"
}
```

 </i>
 </td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">🔐 Havadan Yazılım Güncellemesi (OTA)</span>

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Content-Type</th>
<th>Example</th>
</tr>
<tr>
<td>
POST
</td>
<td>
<b> /ota</b>
</td>
<td>
application/octet-stream
</td>
<td>
<i>
{}
</i>
</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">🔐 Yeniden Başlatma</span>

Duck, aşağıdaki uç nokta kullanılarak yeniden başlatılabilir.

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Content-Type</th>
<th>Example</th>
</tr>
<tr>
<td>
GET
</td>
<td>
<b> /restart</b>
</td>
<td>
application/json
</td>
<td>
<i>
</i>
</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">🔐 Ölçüm Yükleme URL’si</span>

Duck, bağlı cihazların ölçüm yüklemelerini MQTT üzerinden meta veriler yayınlayarak ve sinyal binary dosyalarını HTTP aracılığıyla ileterek yönetir.  
Varsayılan binary yükleme URL’si _<https://core.sensemore.io/measurement/>_ şeklindedir, ancak bu URL aşağıdaki uç nokta kullanılarak alınabilir veya değiştirilebilir.

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Content-Type</th>
<th>Example</th>
</tr>
<tr>
<td>
GET
</td>
<td>
<b> /binary-url</b>
</td>
<td>
application/json
</td>
<td>
<i>

```json
{
  "url": "https://core.sensemore.io/measurement"
}
```

</i>
</td>
</tr>
<tr>
 <td>
 POST
 </td>
 <td>
 <b>/binary-url</b>
 </td>
 <td>
 application/json
 </td>
 <td>
 <i>

```json
{
  "url": "https://core.sensemore.io/measurement"
}
```

 </i>
 </td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">🔐 Sensor Configuration</span>

Duck'ın sensör yapılandırması aşağıdaki HTTP uç noktaları üzerinden görüntülenebilir veya değiştirilebilir.

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Content-Type</th>
<th>Example</th>
</tr>
<tr>
<td>
GET
</td>
<td>
<b> /configuration</b>
</td>
<td>
application/json
</td>
<td>
<i>

```json
{
  "heartbeat_interval_min": 98,
  "sensor_groups": [
    {
      "sensor_group_code": "fe1e2714-5ac0-404c-9eb1-20f3a1d2a214",
      "sensors": [
        {
          "sensor": "accelerometer",
          "channels": [0],
          "channel_codes": ["accelerometer_x"],
          "min_max_voltage": [-5, 5],
          "min_max_value": [-1000, 1000],
          "trigger_differancel_rate": 2
        }
      ]
    }
  ]
}
```

</i>
</td>
</tr>
<tr>
 <td>
 POST
 </td>
 <td>
 <b> /configuration</b>
 </td>
 <td>
 application/json
 </td>
 <td>
 <i>

```json
{
  "heartbeat_interval_min": 98,
  "sensor_groups": [
    {
      "sensor_group_code": "fe1e2714-5ac0-404c-9eb1-20f3a1d2a214",
      "sensors": [
        {
          "sensor": "accelerometer",
          "channels": [0],
          "channel_codes": ["accelerometer_x"],
          "min_max_voltage": [-5, 5],
          "min_max_value": [-1000, 1000],
          "trigger_differancel_rate": 2
        }
      ]
    }
  ]
}
```

 </i>
 </td>
</tr>
</table>

:exclamation: Duck'ın sensör yapılandırmasını değiştirmek cihazın yeniden başlatılmasına neden olacaktır.
