# <span style="color: rgb(240,95,34)">Senseway Entegrasyon Belgesi</span>
<img src="images/Sensemore_product_senseway.gif"/>  

Senseway, Wired Pro, Infinity, Infinity Pro ve Nomad sensörleri için bir ağ geçididir. Senseway, Sensemore sensörleri için ağ bağlantısı, ölçüm planlaması, uyku modu, fdonanım yazılımı güncellemesi ve daha fazlasını yönetir.

Senseway teknik özelliklerini inceleyin:  _<http://sensemore.io/>_  
Senseway kurulum rehberini inceleyin: _<http://sensemore.io/>_

Senseway sistem entegrasyonuna başlamadan önce, Senseway’inizin MQTT, NTP ve HTTP ayarlarını yapılandırın.

### <span style="color: rgb(240,95,34)">Yapılandırma Sayfasına Erişim</span>
Senseway takıldığında, kısa bir süre sonra **SENSEWAY-CA:50:DA:XX:XX:XX** SSID ile bir Wi-Fi erişim noktası ağı yayınlar. AP’ye bağlanmak için varsayılan şifreyi kullanın. Cihazınız, captive portalda yapılandırma sayfasına yönledricektir. Cihazınız otomatik olarak captive portalı açmazsa, varsayılan tarayıcınızda [http:\\\\192.168.4.1 ](http:\192.168.4.1) adresine gidin.  
Senseway, Wi-Fi veya Ethernet üzerinden bir ağa bağlandıktan sonra, yapılandırma sayfasına aynı ağdan cihazın yerel IP adresiyle erişilebilir. Yerel IP adresi, yapılandırma sayfasının ana sekmesinde görüntülenir ve ayrıca MQTT bilgi mesajında gösterilir.

## <span style="color: rgb(240,95,34)">Bağlantı</span>

### <span style="color: rgb(240,95,34)">Wi-Fi & Ethernet</span>
Senseway, ağ bağlantıları için hem Wi-Fi hem de Ethernet’i destekler. Varsayılan olarak, ağ adaptörü Wi-Fi olarak ayarlanmıştır, ancak bu ayar, Konfigürasyon sayfasının `Ayarlar > Bağlantı` bölümünde değiştirilebilir.

### <span style="color: rgb(240,95,34)">NTP</span>
Senseway tarafından gönderilen ölçüm mesajlarında zaman bilgisi de kullanılır. Bunun için zaman senkronizasyonu gereklidir. Yerel veya özel kurulumlarda, Senseway Konfigürasyon sayfasındaki  `Settings > NTP` bölümünden varsayılan NTP sunucusu değiştirilebilir.
_Varsayılan: <http://pool.ntp.org/>_

### <span style="color: rgb(240,95,34)">MQTT</span>
Senseway, MQTT / TLS yapılandırmasına ihtiyaç duyar ve aşağıdakileri içeren çeşitli kimlik doğrulama mekanizmalarını destekler: düz metin MQTT, parola ile veya parolasız MQTTs ve istemci sertifikasıyla MQTTs. Kullanılacak MQTT Broker Sunucusu TLS’yi desteklemelidir ve sertifika tabanlı bağlantılar için aşağıdaki bilgileri sağlamalıdır:

-   MQTT endpoint (_mqtts: //my-mqtt-broker.server: 8883_)
-   CA (CA sertifikası)
-   İstemci Sertifikası (CA tarafından oluşturulan ve imzalanan sertifika)
-   İstemci Anahtarı (CA tarafından oluşturulan sertifikanın özel anahtarı)

Gerekli sertifikalar ve endpoint bilgileri, Senseway konfigürasyon sayfasındaki `Settings > MQTT` bölümünde tanımlanır. Senseway, gelecekteki MQTT bağlantıları için bu sertifikaları kullanır.

Detaylar
https://www.hivemq.com/blog/mqtt-security-fundamentals-tls-ssl/

### <span style="color: rgb(240,95,34)">HTTP</span>
HTTP here..


## <span style="color: rgb(240,95,34)">MQTT Entegrasyonu</span>

Bu bölüm, Senseway ile MQTT üzerinden iletişim kurarken kullanılacak konuları ve mesajların nasıl yorumlanacağını açıklar.

`Aktör` sends `Payload` with `PayloadType` format to `Topic`

### <span style="color: rgb(240,95,34)">Bilgi</span>

Senseway açıldığında, cihazın temel bilgilerini içeren bir durum mesajı yayınlar. Bu mesaj, aşağıdaki konu kullanılarak da alınabilir:

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
Senseway
</td>

<td><b>sensemore/&lt;GatewayMac&gt;/info/accepted</b></td>

<td>JSON</td>
<td>

```json
{
  "Product": "Senseway",
  "Current Running Application": "SENSEWAY_VERSION>",
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
  "Product": "Senseway",
  "Current Running Application": "SENSEWAY-3-0-0",
  "Version": "3.0.0",
  "Compile Date": "Jan 8 2018",
  "Compile Time": "12:00:00",
  "ESP-IDF Version": "v5.1.4",
  "Network Mode": "WIFI",
  "RSSI": -73,
  "Local IP": "192.168.1.111",
  "Network MAC": "00:00:00:00:00:00",
  "Last Reset Reason": "POWERON",
  "Runtime MS": 281440,
  "Memory Info": {
    "Total Free Bytes": 4034708,
    "Total Allocated Bytes": 403896,
    "Min Free Bytes": 4024696,
    "Largest Free Bytes": 3997696
  }
```
</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Havadan Yazılım Güncellemesi (OTA)</span>

Sensemore cihazları HTTP üzerinden yazılım güncellemesini kabul eder. Cihazda yazılım güncellemesi başlatmak için, geçerli bir binary bağlantısı yazılım güncelleme konusuna gönderilir. Senseway, verilen URL’den binary dosyasını indirir ve yazılım güncellemesini başlatır.

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
  "url" : "http://link.mydomain.com/Senseway.bin"  
}
```
</td>
</tr>
<tr>
<td>
Senseway
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
Senseway
</td>

<td><b>sensemore/&lt;GatewayMac&gt;/ota/rejected</b></td>
<td><i>Text</i></td>
<td><i>Error Text</i></td>
<td>
Invalid payload! Url can't be null. Valid payload scheme: {
	"url":"http://link.mydomain.com/Senseway.bin"
}
</td>
</tr>
<tr>
<td>
Senseway
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

### <span style="color: rgb(240,95,34)">Yeniden Başlatma</span>

Senseway cihazını uzaktan yeniden başlatmak için aşağıdaki konu kullanılır.

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

### <span style="color: rgb(240,95,34)">Ölçüm Yükleme URL’si</span>

Senseway, bağlı cihazların ölçüm yüklemelerini MQTT üzerinden meta veriler yayınlayarak ve sinyal biney dosyalarını HTTP aracılığıyla ileterek yönetir.  
Varsayılan ikili yükleme URL’si _<https://core.sensemore.io/measurement/>_ şeklindedir, ancak bu URL aşağıdaki konu başlığı kullanılarak alınabilir veya değiştirilebilir.

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
<b> sensemore/&lt;GatewayMac&gt;/binaryurl/get</b>
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
 Senseway
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/binaryurl/get/accepted</b>
 </td>
 <td>
 JOSN
 </td>
 <td>
 <i>Binary URL JSON</i>
 </td>
 <td>

 ```json
{
  "binaryurl": "https://core.sensemore.io/measurement"
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
<b> sensemore/&lt;GatewayMac&gt;/binaryurl/set</b>
</td>
<td>
JSON
</td>
<td>
<i>Binary URL JSON</i>
</td>
<td>
<i>

```json
{
  "binaryurl": "https://core.sensemore.io/measurement"
}
```
</i>
</td>
</tr>
<tr>
 <td>
 Senseway
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/binaryurl/set/accepted</b>
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
  "status": "Set Binary url accepted",
  "binaryurl": "https://core.sensemore.io/measurement"
}
```
 </td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Senseway - Wired Pro İlestişim Hızı</span>

Senseway, Wired Pro ile RS485 üzerinden iletişim kurar ve bu sistemin teorik menzili 1 kilometreye kadar ulaşabilir. Bu, Senseway ile Wired Pro’nun 1 km mesafeye kadar birbirinden uzak yerleştirilip bir RS485 kablosu ile bağlanmasını sağlar. Aralarındaki mesafe arttıkça, iletişim güvenilirliği artırmak için baudrate değeri düşürülmelidir.Baudrate, saniyede iletilen bit sayısını ifade eder. Daha kısa mesafelerde, baudrate’i artırmak Senseway ve Wired Pro arasındaki iletişim hızını yükseltebilir. Baudrate, aşağıdaki MQTT konu başlığı kullanılarak görüntülenebilir veya değiştirilebilir:

:warning: Birden fazla Wired Pro’yu aynı Senseway’e bağlarken, bir bus topolojisi kullanılmalı ve paralel hatların olmamasına dikkat edilmelidir.

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
<b> sensemore/&lt;GatewayMac&gt;/baudrate/get</b>
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
 Senseway
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/baudrate/get/accepted</b>
 </td>
 <td>
 JOSN
 </td>
 <td>
 <i>Baudrate JSON</i>
 </td>
 <td>

 ```json
{
  "baudrate": 921600
}
```
 </td>
</tr>
</table>

**Geçerli baudrate değerleri::** 115200, 460800, 921600, 1000000

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
<b> sensemore/&lt;GatewayMac&gt;/baudrate/set</b>
</td>
<td>
JSON
</td>
<td>
<i>Baudrate JSON</i>
</td>
<td>
<i>

```json
{
  "baudrate": 921600
}
```
</i>
</td>
</tr>
<tr>
 <td>
 Senseway
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/baudrate/set/accepted</b>
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
  "status": "Set baud rate accepted",
  "baudrate": 921600
}
```
 </td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Cihaz Listesi</span>

Senseway’e bağlı cihazların ve bunların ölçüm yapılandırmalarının listesi, aşağıdaki konu başlığı kullanılarak alınabilir.

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
<b> sensemore/&lt;GatewayMac&gt;/device-list/get</b>
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
 Senseway
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/device-list/get/accepted</b>
 </td>
 <td>
 JOSN
 </td>
 <td>
 <i>Scan JSON</i>
 </td>
 <td>

 ```json
{
  "devices": [
    {
      "mac": "CA:B8:41:XX:XX:XX",
      "device_config": {
        "rs485_resistor_enabled": false,
        "trigger_enabled": false,
        "accelerometer_range": 16,
        "sampling_rate": 25600,
        "sample_size": 50000,
        "sensor_type": 1,
        "scheduler_enabled": false
      }
    },
    {
      "mac": "CA:B8:30:XX:XX:XX",
      "device_config": {
        "rs485_resistor_enabled": false,
        "trigger_enabled": false,
        "accelerometer_range": 16,
        "sampling_rate": 25600,
        "sample_size": 50000,
        "sensor_type": 1,
        "scheduler_enabled": false
      }
    }
  ]
}
```
 </td>
</tr>
</table>

Senseway, her atanan sensörün bağlantı durumunu bir tarama komutu aldığında değerlendirir. Ardından, bağlı her cihazın **Donanım Yaılımı Sürümünü** içeren bir sonuç mesajı yayınlar.  

:warning: Infinity, Infinity Pro ve Nomad, uyku programında iseler “not scanned” olarak görünebilir.

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
 Senseway
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/devices/get/accepted</b>
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
  "devices": [
    {
      "mac": "CA:B8:41:XX:XX:XX",
      "status": "connected",
      "version": "2.1.14",
      "device_config": {
        "rs485_resistor_enabled": false,
        "trigger_enabled": false,
        "accelerometer_range": 16,
        "sampling_rate": 25600,
        "sample_size": 50000,
        "sensor_type": 1,
        "scheduler_enabled": false
      }
    },
    {
      "mac": "CA:B8:30:XX:XX:XX",
      "status": "scanned",
      "rssi": -58,
      "version": "3.0,0",
      "device_config": {
        "rs485_resistor_enabled": false,
        "trigger_enabled": false,
        "accelerometer_range": 16,
        "sampling_rate": 25600,
        "sample_size": 50000,
        "sensor_type": 1,
        "scheduler_enabled": false
      }
    }
  ]
}
```
 </td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Havadan Cihaz Yazılım Güncellemesi (OTA)</span>

Sensemore uç nokta cihazları, donanım yazılım güncellemesini HTTP üzerinden kabul eder. Uç nokta cihazında donanım yazılım güncellemesi başlatmak için geçerli binary link'i, donanım yazılım güncelleme konusu üzerinden gönderilir. Senseway, verilen URL’den binary dosyasını indirir ve belirli cihaz için donanım yazılım güncellemesini başlatır.

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

<td><b>sensemore/&lt;GatewayMac&gt;/device/&lt;DeviceMac&gt;/ota</b></td>
<td>JSON</td>
<td>
<i>http url</i>
</td>
<td>

```json
  {
    "url": "http://link.mydomain.com/Device.bin"
  }
  ```
</td>
</tr>
<tr>
<td>
Senseway
</td>

<td><b>sensemore/&lt;GatewayMac&gt;/device/&lt;DeviceMac&gt;/ota/accepted</b></td>
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
Senseway
</td>

<td><b>sensemore/&lt;GatewayMac&gt;/device/&lt;DeviceMac&gt;/ota/rejected</b></td>
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
Senseway
</td>
<td><b>sensemore/&lt;GatewayMac&gt;/device/&lt;DeviceMac&gt;/ota/done</b></td>
<td><i>JSON</i></td>
<td><i>Status JSON</i></td>
<td></td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Cihaz Ekle & Çıkar</span>

Senseway’in sensör yapılandırması, aşağıdaki konular üzerinden MQTT üzerinden görüntülenebilir veya değiştirilebilir. 

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
<b> sensemore/&lt;GatewayMac&gt;/device/add</b>
</td>
<td>
JSON
</td>
<td>
<i>Mac JSON</i>
</td>
<td>
<i>

```json
{
  "mac" : "CA:B8:XX:XX:XX:XX"
}
```
</i>
</td>
</tr>
<tr>
 <td>
 Senseway
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/device/add/accepted</b>
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
  "status": "Device added"
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
<b> sensemore/&lt;GatewayMac&gt;/device/remove</b>
</td>
<td>
JSON
</td>
<td>
<i>Mac JSON</i>
</td>
<td>
<i>

```json
{
  "mac" : "CA:B8:XX:XX:XX:XX"
}
```
</i>
</td>
</tr>
<tr>
 <td>
 Senseway
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/device/remove/accepted</b>
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
  "status": "Device removed"
}
```
 </td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Cihaz Ölçüm Yapılandırılması</span>

Senseway, hem kablolu sensörler (Wired Pro) hem de kablosuz sensörlerle (Infinity, Infinity Pro, Nomad) uyumludur. Kablosuz sensörler, genellikle batarya ömrünü uzatmak için bir uyku programı özelliği kullanır ve bu özellik, tek bir şarjla 2 yıla kadar çalışma sağlar.

<table>
<tr>
<th>Device Config</th>
<th>Explaniation</th>
</tr>
<tr>
<td>

```json

{
  "device_mac": "CA:B8:XX:XX:XX:XX",
  "device_config": {
    "rs485_resistor_enabled": false,
    "accelerometer_range": 16,
    "sampling_rate": 25600,
    "sample_size": 50000,
    "sensor_type": 1,
    "scheduler_enabled": false,
    "trigger_enabled": false
  }
}
```

</td>
<td>

```json

{
  "device_mac": "Device ID",
  "device_config": {
    "rs485_resistor_enabled": Termination resistor, only applicable to Wired Pro,
    "accelerometer_range": 16,
    "sampling_rate": 25600,
    "sample_size": 50000,
    "sensor_type": [1 for accelerometer, 0 for unkown devices],
    "scheduler_enabled": Periodic measurement & sleep schedule for Infinity family devices,
    "trigger_enabled": Senseway tigger number for a perticular device
  }
}
```
</td>
<td>
</tr>
</table>
:warning: Birden fazla Wired Pro aynı Senseway’e bağlandığında, sadece Senseway’e en uzak olan Wired Pro’nun terminasyon direncinin etkinleştirilmesi gerekir.
Aynı Senseway’e bağlı birden fazla Wired Pro’nun terminasyon dirençlerini etkinleştirmek, cihazlarınıza kalıcı olarak zarar verebilir.

Belirli bir cihazın yapılandırması, aşağıdaki konu başlığı kullanılarak alınabilir.

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
<b> sensemore/&lt;GatewayMac&gt;/device/&lt;DeviceMac&gt;/config/get</b>
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
 Senseway
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/device/&lt;DeviceMac&gt;/config/get/accepted</b>
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
    "rs485_resistor_enabled": false,
    "accelerometer_range": 16,
    "sampling_rate": 25600,
    "sample_size": 50000,
    "sensor_type": 1,
    "scheduler_enabled": false,
    "trigger_enabled": false
  }
}
```
 </td>
</tr>
</table>

Belirli bir cihazın yapılandırması, aşağıdaki konu başlığı kullanılarak değiştirilebilir.

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
<b> sensemore/&lt;GatewayMac&gt;/device/&lt;DeviceMac&gt;/config/set</b>
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
  "device_config": {
    "rs485_resistor_enabled": false,
    "accelerometer_range": 16,
    "sampling_rate": 25600,
    "sample_size": 50000,
    "sensor_type": 1,
    "scheduler_enabled": false,
    "scheduler_period": false,
    "trigger_enabled": false,
    "trigger_pin": false
  }
}
```
</i>
</td>
</tr>
<tr>
 <td>
 Senseway
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/device/&lt;DeviceMac&gt;/config/set/accepted</b>
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
  "device_config": {
    "rs485_resistor_enabled": false,
    "accelerometer_range": 16,
    "sampling_rate": 25600,
    "sample_size": 50000,
    "sensor_type": 1,
    "scheduler_enabled": false,
    "scheduler_period": false,
    "trigger_enabled": false,
    "trigger_pin": false
  },
  "status": "Device config updated",
  "mac": "End Node Mac"
}
```
 </td>
</tr>
</table>


### <span style="color: rgb(240,95,34)">Ölçüm</span>

Senseway, planlama özelliğini kullanarak otomatik ölçüm başlatır. Ayrıca, daha önce yapılandırılan ayarlara göre Sensemore Lake platformu ve MQTT üzerinden manuel ölçümleri kabul eder. MQTT ölçüm konuları aşağıdaki gibidir.

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
<b> sensemore/&lt;GatewayMac&gt;/device/&lt;DeviceMac&gt;/measure/&lt;MeasuremnetUUID&gt;</b>
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
 Senseway
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/device/&lt;DeviceMac&gt;/measure/&lt;MeasuremnetUUID&gt;/accepted</b>
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
  "status": "Measurement started"
}
```
 </td>
</tr>
</tr>
<tr>
 <td>
 Senseway
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/device/&lt;DeviceMac&gt;/measure/&lt;MeasuremnetUUID&gt;/done</b>
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
  "status": "Measurement done"
}
```
 </td>
</tr>
</tr>
<tr>
 <td>
 Senseway
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/device/&lt;DeviceMac&gt;/measure/&lt;MeasuremnetUUID&gt;/metadatas</b>
 </td>
 <td>
 JOSN
 </td>
 <td>
 <i>Metadata JSON</i>
 </td>
 <td>

 ```json
{
  "unixtimestamp": 1734443808,
  "calibrated_sampling_rate": 26746,
  "temperature": 22.719999313354492,
  "battery_voltage": 4.0489997863769531,
  "sampling_rate": 25600,
  "sample_size": 50000,
  "accelerometer_range": 16,
  "measurement_type": 1,
  "measurement_buffer_size": 300000
}
```
 </td>
</tr>
</table>

## <span style="color: rgb(240,95,34)">HTTP Entegrasyonu</span>

heree.