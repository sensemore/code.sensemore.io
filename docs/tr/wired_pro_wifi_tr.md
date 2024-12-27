# <span style="color: rgb(240,95,34)">Wired Pro Wi-Fi Integration Documentation</span>

### <span style="color: rgb(240,95,34)">Wired Pro İşlem Modları</span>

:exclamation: Wired Pro, iki farklı işlem moduna sahip çok yönlü bir IoT veri toplama cihazıdır.  
**1. RS485 modu:**  
Bu modda, Wired Pro bir RS485 kablosu aracılığıyla Senseway (veya diğer ağ geçitleri) ile bağlantı kurar. Ağ geçidi tarafından kontrol edilir ve 3 eksenli ivmeölçer, manyetometre ve sıcaklık sensörü olarak çalışır. Daha fazla detay için [Senseway Entegrasyon Belgelerine](tr/senseway_system_integration_tr.md) bakınız.  
**2. Wi-Fi modu:**  
Wi-Fi modunda, Wired Pro kendi başına bir ağ geçidi olarak çalışır ve sensörlerini bağımsız olarak yönetir. Bu dokümantasyon, Wi-Fi moduna odaklanmaktadır.

<img src="images/Sensemore_product_wiredpro.gif"/>

Wired Pro Wi-Fi, 3 eksenli ivmeölçer, manyetik alan ve sıcaklık ölçümleri alabilen bir sensör dizisi ve ağ geçididir. Ölçümleri işleyebilir, ölçüm stratejilerini uygulayabilir ve verileri buluta yükleyebilir. 5-36V DC girişle beslenen Wired Pro Wi-Fi, şarj edilmesine gerek olmadan çalışır.

Wired Pro Wi-Fi teknik özelliklerini inceleyin: _<http://sensemore.io/>_  
Wired Pro Wi-Fi kurulum rehberini inceleyin: _<http://sensemore.io/>_

Wired Pro Wi-Fi sistem entegrasyonuna başlamadan önce, Wired Pro Wi-Fi’inizin MQTT, NTP ve HTTP ayarlarını yapılandırın.

### <span style="color: rgb(240,95,34)">Yapılandırma Sayfasına Erişim</span>

Wired Pro takıldığında, kısa bir süre sonra **WiredPro-CA:B8:41:XX:XX:XX** SSID ile bir Wi-Fi erişim noktası ağı yayınlar. AP’ye bağlanmak için varsayılan şifreyi kullanın. Cihazınız, captive portalda yapılandırma sayfasına yönledricektir. Cihazınız otomatik olarak captive portalı açmazsa, varsayılan tarayıcınızda [http:\\\\192.168.4.1 ](http:\192.168.4.1) adresine gidin.  
Wired Pro, Wi-Fi üzerinden bir ağa bağlandıktan sonra, yapılandırma sayfasına aynı ağdan cihazın yerel IP adresiyle erişilebilir. Yerel IP adresi, yapılandırma sayfasının ana sekmesinde görüntülenir ve ayrıca MQTT bilgi mesajında gösterilir.

## <span style="color: rgb(240,95,34)">Bağlantı</span>

### <span style="color: rgb(240,95,34)">Wi-Fi </span>

Wired Pro, kablosuz ağ bağlantıları için Wi-Fi desteği sunar.

### <span style="color: rgb(240,95,34)">NTP</span>

Wired Pro Wi-Fi tarafından gönderilen ölçüm mesajlarında zaman bilgisi de kullanılır. Bunun için zaman senkronizasyonu gereklidir. Yerel veya özel kurulumlarda, Wired Pro Wi-Fi Konfigürasyon sayfasındaki `Settings > NTP` bölümünden varsayılan NTP sunucusu değiştirilebilir.
_Varsayılan: <http://pool.ntp.org/>_

### <span style="color: rgb(240,95,34)">MQTT</span>

Wired Pro Wi-Fi, MQTT / TLS yapılandırmasına ihtiyaç duyar ve aşağıdakileri içeren çeşitli kimlik doğrulama mekanizmalarını destekler: düz metin MQTT, parola ile veya parolasız MQTTs ve istemci sertifikasıyla MQTTs. Kullanılacak MQTT Broker Sunucusu TLS’yi desteklemelidir ve sertifika tabanlı bağlantılar için aşağıdaki bilgileri sağlamalıdır:

- MQTT endpoint (_mqtts: //my-mqtt-broker.server: 8883_)
- CA (CA sertifikası)
- İstemci Sertifikası (CA tarafından oluşturulan ve imzalanan sertifika)
- İstemci Anahtarı (CA tarafından oluşturulan sertifikanın özel anahtarı)

Gerekli sertifikalar ve endpoint bilgileri, Wired Pro Wi-Fi konfigürasyon sayfasındaki `Settings > MQTT` bölümünde tanımlanır. Wired Pro Wi-Fi, gelecekteki MQTT bağlantıları için bu sertifikaları kullanır.

Detaylar
https://www.hivemq.com/blog/mqtt-security-fundamentals-tls-ssl/

### <span style="color: rgb(240,95,34)">HTTP</span>

Wired Pro, HTTP üzerinden kontrol edilebilir, bu da yapılandırma değişiklikleri ve ölçüm işlemleri yapmayı sağlar. HTTP uç noktalarına erişim, önce bir giriş yapmayı gerektirir, ardından alınan belirteç, sonraki iletişimlerde kullanılmalıdır. HTTP uç noktaları hakkında detaylı bilgi, Wired Pro Yapılandırma Web Sayfası tarafından kullanılanlar dahil, HTTP Entegrasyon bölümünde mevcuttur.

## <span style="color: rgb(240,95,34)">MQTT Entegrasyonu</span>

Bu bölüm, Wired Pro Wi-Fi ile MQTT üzerinden iletişim kurarken kullanılacak konuları ve mesajların nasıl yorumlanacağını açıklar.

`Aktör` sends `Payload` with `PayloadType` format to `Topic`

### <span style="color: rgb(240,95,34)">Bilgi</span>

Wired Pro Wi-Fi açıldığında, cihazın temel bilgilerini içeren bir durum mesajı yayınlar. Bu mesaj, aşağıdaki konu kullanılarak da alınabilir:

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

### <span style="color: rgb(240,95,34)">Havadan Yazılım Güncellemesi (OTA)</span>

Sensemore cihazları HTTP üzerinden yazılım güncellemesini kabul eder. Cihazda yazılım güncellemesi başlatmak için, geçerli bir binary bağlantısı yazılım güncelleme konusuna gönderilir. Wired Pro, verilen URL’den binary dosyasını indirir ve yazılım güncellemesini başlatır.

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
  "url": "http://link.mydomain.com/WiredPro.bin"
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

### <span style="color: rgb(240,95,34)">Yeniden Başlatma</span>

Wired Pro Wi-Fi cihazını uzaktan yeniden başlatmak için aşağıdaki konu kullanılır.

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

### <span style="color: rgb(240,95,34)">Cihaz Yapılandırması</span>

Wired Pro’nun ölçüm stratejisi ve yapılandırması, aşağıdaki konu başlığı kullanılarak alınabilir.

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
 JSON
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

### <span style="color: rgb(240,95,34)">Ölçüm Yapılandırması</span>

Wired Pro’nun ölçüm yapılandırması, aşağıdaki konular üzerinden MQTT ile görüntülenebilir veya değiştirilebilir.

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
 JSON
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
 JSON
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

### <span style="color: rgb(240,95,34)">Ölçüm</span>

Wired Pro, planlama özelliğini kullanarak otomatik ölçüm başlatır. Ayrıca, daha önce yapılandırılan ayarlara göre Sensemore Lake platformu ve MQTT üzerinden manuel ölçümleri kabul eder. MQTT ölçüm konuları aşağıdaki gibidir.

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

## <span style="color: rgb(240,95,34)">HTTP Entegrasyonu</span>

## <span style="color: rgb(240,95,34)">HTTP Entegrasyonu</span>

Wired Pro ayarlarını görüntülemek veya değiştirmek için kapsamlı HTTP uç noktaları bulunur.

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
  "mac_address": "CA:B8:50:XX:XX:XX",
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

Zaman bilgisi, Wired Pro tarafından gönderilen ölçüm mesajlarının bir parçasıdır. NTP yapılandırması, aşağıdaki HTTP uç noktası kullanılarak alınabilir veya değiştirilebilir.

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

Wired Pro, aşağıdaki uç nokta kullanılarak yeniden başlatılabilir.

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

Wired Pro, ölçüm yüklemelerini MQTT üzerinden meta veriler yayınlayarak ve sinyal binary dosyalarını HTTP aracılığıyla ileterek yönetir.  
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

### <span style="color: rgb(240,95,34)">🔐 Ölçüm Yapılandırması</span>

Wired Pro’nun ölçüm yapılandırması, aşağıdaki HTTP uç noktası ile görüntülenebilir veya değiştirilebilir.

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
  "accelerometer_range": 16,
  "sampling_rate": 25600,
  "sample_size": 50000,
  "scheduler_enabled": 0,
  "scheduler_period": 0
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
 <b>/configuration</b>
 </td>
 <td>
 application/json
 </td>
 <td>
 <i>

```json
{
  "accelerometer_range": 16,
  "sampling_rate": 25600,
  "sample_size": 50000,
  "scheduler_enabled": 0,
  "scheduler_period": 0
}
```

 </i>
 </td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">🔐 Ölçüm </span>

Wired Pro, planlama özelliğini kullanarak otomatik ölçüm başlatır. Ayrıca, daha önce yapılandırılan ayarlara göre Sensemore Lake platformu, MQTT ve HTTP üzerinden manuel ölçümleri kabul eder. HTTP ölçüm uç noktası aşağıdaki gibidir.

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Content-Type</th>
<th>Example</th>
</tr>
<tr>
<td>
Post
</td>
<td>
<b> /measure</b>
</td>
<td>
application/json
</td>
<td>
<i>

```json
{}
```

</i>
</td>
</tr>
</table>
