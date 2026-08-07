# <span style="color: rgb(240,95,34)">Wired Pro Entegrasyon Dokümantasyonu</span>

### <span style="color: rgb(240,95,34)">Wired Pro İşlem Modları</span>

❗️ Wired Pro, iki farklı işlem moduna sahip çok yönlü bir IoT veri toplama cihazıdır.
**1. RS485 modu:**
Bu modda Wired Pro, bir RS485 kablosu üzerinden Senseway'e (veya üçüncü taraf bir ağ geçidine) bağlanır. Ağ geçidi tarafından kontrol edilir ve 3 eksenli ivmeölçer ile sıcaklık sensörü olarak çalışır. Hat protokolü aşağıdaki [RS485 Entegrasyonu](#rs485-integration) bölümünde belgelenmiştir. Senseway ağ geçidinin kendisi için [Senseway Entegrasyon Dokümantasyonu](senseway_system_integration_tr.md)'na bakınız.
**2. Wi-Fi modu:**
Wi-Fi modunda Wired Pro kendi ağ geçidi olarak çalışır ve sensörlerini bağımsız olarak yönetir. [MQTT Entegrasyonu](#mqtt-integration) ve [HTTP Entegrasyonu](#http-integration) bölümleri bu modu anlatır.

<img src="../images/Sensemore_product_wiredpro.gif"/>

Wired Pro, 3 eksenli ivme ve sıcaklık ölçümleri alabilen, ağ geçidi ve sensör dizisi birleşimi bir cihazdır. Ölçümleri işleyebilir, ölçüm stratejilerini uygulayabilir ve verileri buluta yükleyebilir. 5-24V DC girişle beslenen Wired Pro, şarj edilmesine gerek olmadan çalışır.

Wired Pro sistem entegrasyonuna başlamadan önce Wired Pro'nuzun MQTT, NTP ve HTTP ayarlarını yapılandırın.

### <span style="color: rgb(240,95,34)">Yapılandırma Sayfasına Erişim</span>

Wired Pro takıldıktan kısa bir süre sonra **WiredPro-CA&colon;B8&colon;41&colon;XX&colon;XX&colon;XX** SSID'si ile bir Wi-Fi erişim noktası ağı yayınlar. Erişim noktasına bağlanmak için varsayılan şifreyi kullanın. Cihazınız yapılandırma sayfasını bir captive portal içinde açacaktır. Cihazınız captive portalı otomatik olarak açmazsa, varsayılan tarayıcınızdan [http://192.168.4.1](http://192.168.4.1) adresine gidin.
Wired Pro Wi-Fi üzerinden bir ağa bağlandıktan sonra yapılandırma sayfasına, aynı ağdan cihazın yerel IP adresi üzerinden erişilebilir. Yerel IP adresi yapılandırma sayfasının ana sekmesinde görüntülenir ve ayrıca MQTT bilgi mesajında da yer alır.

## <span style="color: rgb(240,95,34)">Bağlantı</span>

### <span style="color: rgb(240,95,34)">Wi-Fi</span>

Wired Pro, kablosuz ağ bağlantıları için Wi-Fi destekler.

### <span style="color: rgb(240,95,34)">NTP</span> :id=ntp

Wired Pro tarafından gönderilen ölçüm mesajlarında zaman bilgisi kullanıldığından zaman senkronizasyonu gereklidir. OnPremise veya özel kurulumlarda varsayılan NTP sunucusu, Wired Pro yapılandırma sayfasındaki `Settings > NTP` bölümünden ya da [`/sntp`](#-ntp) uç noktası üzerinden değiştirilebilir.

❗️ Bu değer bir URL değil, **NTP sunucu ana bilgisayar adıdır**. Başına şema
ekleyip sonuna yol eklemeyin — `pool.ntp.org` geçerlidir, `http://pool.ntp.org/` geçerli
değildir ve cihazın saatini senkronize etmesini engeller.

_Varsayılan: `pool.ntp.org`_

### <span style="color: rgb(240,95,34)">MQTT</span>

Wired Pro, MQTT / TLS yapılandırmasına ihtiyaç duyar ve şu kimlik doğrulama mekanizmalarını destekler: düz metin MQTT, parolalı veya parolasız MQTTs ve istemci sertifikalı MQTTs. Kullanılacak MQTT broker sunucusu TLS desteklemeli ve sertifika tabanlı bağlantılar için aşağıdakileri sağlamalıdır:

- MQTT uç noktası (_mqtts: //my-mqtt-broker.server: 8883_)
- CA (CA sertifikası)
- İstemci Sertifikası (CA tarafından oluşturulan ve imzalanan sertifika)
- İstemci Anahtarı (CA aracılığıyla üretilen sertifikanın özel anahtarı)

Gerekli sertifikalar ve uç nokta bilgileri, Wired Pro yapılandırma sayfasındaki `Settings > MQTT` bölümünde tanımlanır. Wired Pro sonraki MQTT bağlantıları için bu sertifikaları kullanır.

Detaylar
https://www.hivemq.com/blog/mqtt-security-fundamentals-tls-ssl/

### <span style="color: rgb(240,95,34)">HTTP</span>

Wired Pro, HTTP üzerinden kontrol edilebilir; bu sayede yapılandırma değişiklikleri ve ölçüm işlemleri yapılabilir. HTTP uç noktalarına erişim önce bir giriş yapmayı gerektirir, ardından alınan token sonraki iletişimlerde kullanılmalıdır. Ayrıntılı bilgi [HTTP Entegrasyonu](#http-integration) bölümünde yer alır.

### <span style="color: rgb(240,95,34)">RS485</span>

RS485 modunda Wired Pro, yarı çift yönlü bir RS485 veri yolunda slave olarak çalışır ve EasyCom
çerçeve protokolünü konuşur. Bkz. [RS485 Entegrasyonu](#rs485-integration).

## <span style="color: rgb(240,95,34)">Ölçüm Stratejisi</span> :id=measurement-strategy

❗️ **3.1.x ile değişti.** Önceki yazılım sürümleri sabit periyotlu bir zamanlayıcı
(`scheduler_period`) sunuyordu. Bu alan artık mevcut değildir. Wired Pro artık **akıllı ölçüm**
stratejisiyle çalışır: sürekli olarak hafif bir RMS değerini izler ve tam ölçümü yalnızca
titreşim seviyesi gerçekten değiştiğinde tetikler; verinin hiç kesilmemesi için garantili bir
heartbeat (kalp atışı) aralığı da vardır.

Aşağıdakilerden **herhangi biri** sağlandığında tam ölçüm tetiklenir:

1. Açılıştan veya bir yapılandırma değişikliğinden sonraki ilk değerlendirmedir.
2. `now - last_trigger >= hearthbeat_interval_seconds` — heartbeat aralığı.
3. Her iki değişim eşiği de aşılmıştır **ve** minimum aralık dolmuştur:
   - `|rms - previous_rms| >= absolute_change`, **ve**
   - `|rms - previous_rms| / previous_rms >= relative_change`, **ve**
   - `now - last_trigger >= min_trigger_interval_seconds`

Hem mutlak hem de bağıl eşiğin birlikte aranması, makine boştayken sensör gürültüsü yüzünden
tekrar tetiklenmeyi önler ve titreşim yükseldiğinde cihazın tepkisel kalmasını sağlar.

### Yapılandırma alanları

Bu alanlar [`/configuration`](#-http-measurement-configuration) HTTP uç noktası ile
[`device/<mac>/config/set`](#mqtt-measurement-configuration) MQTT konusu tarafından ortak kullanılır.

| Alan                             | Tip      | Geçerli değerler                                            | Varsayılan | Açıklama                                        |
| -------------------------------- | -------- | ----------------------------------------------------------- | ---------- | ----------------------------------------------- |
| `accelerometer_range`          | sayı     | `2`, `4`, `8`, `16`                                 | `16`     | g cinsinden tam ölçek aralığı                   |
| `sampling_rate`                | sayı     | `800`, `1600`, `3200`, `6400`, `12800`, `25600` | `25600`  | Hz                                              |
| `sample_size`                  | sayı     | `100` – `120000`                                       | `50000`  | Eksen başına örnek sayısı                       |
| `scheduler_enabled`            | nota bak | HTTP'de `0`/`1`, MQTT'de `true`/`false`             | `0`      | Akıllı ölçümü etkinleştirir                     |
| `hearthbeat_interval_seconds`  | sayı     | `>= 900`                                                  | `1800`   | Garantili ölçüm aralığı                         |
| `min_trigger_interval_seconds` | sayı     | `>= 60` ve `<= hearthbeat_interval_seconds`             | `300`    | Değişimle tetiklenen ölçümler için hız sınırı   |
| `relative_change`              | sayı     | `>= 0`                                                    | `0.10`   | Oran, örn.`0.10` = %10                        |
| `absolute_change`              | sayı     | `>= 0`                                                    | `0.05`   | g cinsinden mutlak değişim                      |

❗️ Dikkat edilmesi gereken iki nokta:

- **`hearthbeat_interval_seconds` tam olarak burada yazıldığı gibidir** (`th` ile). Bu, hat
  üzerindeki anahtarın kendisidir; yazım hatası geriye dönük uyumluluk için korunmuştur.
- **`scheduler_enabled` alanının tipi taşımaya göre değişir**: HTTP üzerinden JSON **sayı**
  (`0`/`1`), MQTT üzerinden JSON **boolean** (`true`/`false`) olmalıdır. Yanlış tip gönderimi
  reddedilir.

Her yazma işleminde sekiz alanın tamamı **zorunludur**. Alanlardan herhangi birinin eksik olduğu
veya yukarıdaki aralık kısıtlarını ihlal eden bir istek reddedilir — HTTP `400` döndürür, MQTT ise
ilgili `.../rejected` konusuna, durum mesajında hatalı alanın adıyla birlikte yayın yapar.

## <span style="color: rgb(240,95,34)">MQTT Entegrasyonu</span> :id=mqtt-integration

Bu bölüm, Wired Pro ile MQTT üzerinden iletişim kurarken hangi konuların kullanılacağını ve mesajların nasıl yorumlanacağını açıklar.

`Actor`, `Topic` konusuna `PayloadType` biçiminde `Payload` gönderir

### <span style="color: rgb(240,95,34)">Bilgi</span>

Wired Pro açıldığında, **Yazılım Sürümü** dahil temel cihaz bilgilerini içeren bir durum mesajı yayınlar. Bu durum mesajı aşağıdaki konu kullanılarak da alınabilir:

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
  "Current Running Application": "<WIREDPRO_APPLICATION_NAME>",
  "Version": "<FIRMWARE_VERSION>",
  "Compile Date": "<FIRMWARE_COMPILE_DATE>",
  "Compile Time": "<FIRMWARE_COMPILE_TIME>",
  "ESP-IDF Version": "<ESPRESSIF_IDF_VERSION>",
  "RSSI": <RECEIVED_SIGNAL_STRENGTH_INDICATOR>,
  "Local IP": "<ASSIGNED_LOCAL_IP>",
  "Network MAC": "<NETWORK_MAC_ADDRESS>",
  "Last Reset Reason": "<RESET_REASON>",
  "Runtime MS": <TIME_SINCE_LAST_RESET>,
  "Memory Info": {
    "Total Free Bytes": <TOTAL_FREE_HEAP_BYTES>,
    "Total Allocated Bytes": <TOTAL_ALLOCATED_HEAP_BYTES>,
    "Min Free Bytes": <MIN_FREE_HEAP_BYTES>,
    "Largest Free Bytes": <LARGEST_FREE_HEAP_BLOCK_BYTES>
  }
}
```

</td>
<td>

```json
{
  "Product": "WIREDPRO",
  "Current Running Application": "WiredPro-3-1-2",
  "Version": "3.1.2",
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

❗️ `Memory Info`, depolama kapasitesini değil **heap** (yığın) istatistiklerini bildirir.

### <span style="color: rgb(240,95,34)">Havadan Yazılım Güncellemesi (OTA)</span>

Sensemore cihazları HTTP üzerinden yazılım güncellemesi kabul eder. Cihazda yazılım güncellemesi başlatmak için yazılım güncelleme konusuna geçerli bir ikili dosya bağlantısı gönderin. Wired Pro, verilen URL'den ikili dosyayı indirir ve güncellemeyi başlatır.

❗️ URL **düz `http://` olmalıdır**. `https://` URL'leri reddedilir — TLS yığını
MQTT bağlantısı ve ölçüm yüklemesi için ayrılmıştır. Güncelleme dosyasını, cihazdan erişilebilen
düz metin bir HTTP uç noktasında barındırın.

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
<td>JSON</td>
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
<td>JSON</td>
<td><i>Status JSON</i></td>
<td>

```json
{
  "status": "'url' is not exists or invalid!"
}
```

</td>
</tr>
<tr>
<td>
Wired Pro
</td>
<td><b>sensemore/&lt;GatewayMac&gt;/ota/done</b></td>
<td>JSON</td>
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

Wired Pro aşağıdaki konu kullanılarak yeniden başlatılabilir.

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

❗️ Bu yalnızca abone olunan bir konudur. Cihaz onay yayınlamaz — yalnızca yeniden
başlar ve tekrar bağlandığında `info/accepted` mesajını yeniden yayınlar.

### <span style="color: rgb(240,95,34)">Cihaz Yapılandırması</span>

Wired Pro'nun ölçüm stratejisi ve yapılandırması aşağıdaki konu kullanılarak alınabilir.

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
      "version": "3.1.2",
      "device_config": {
        "accelerometer_range": 16,
        "sampling_rate": 25600,
        "sample_size": 50000,
        "scheduler_enabled": true,
        "hearthbeat_interval_seconds": 1800,
        "min_trigger_interval_seconds": 300,
        "relative_change": 0.1,
        "absolute_change": 0.05
      }
    }
  ]
}
```

 </td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">MQTT Ölçüm Yapılandırması</span> :id=mqtt-measurement-configuration

Wired Pro'nun ölçüm yapılandırması, aşağıdaki konular ile MQTT üzerinden görüntülenebilir veya değiştirilebilir. Alan anlamları ve kısıtlar [Ölçüm Stratejisi](#measurement-strategy) bölümünde belgelenmiştir.

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
  "device_mac": "CA:B8:41:XX:XX:XX",
  "device_config": {
    "accelerometer_range": 16,
    "sampling_rate": 25600,
    "sample_size": 50000,
    "scheduler_enabled": true,
    "hearthbeat_interval_seconds": 1800,
    "min_trigger_interval_seconds": 300,
    "relative_change": 0.1,
    "absolute_change": 0.05
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
<i>Config JSON — all eight fields required</i>
</td>
<td>
<i>

```json
{
  "device_mac": "CA:B8:41:XX:XX:XX",
  "device_config": {
    "accelerometer_range": 16,
    "sampling_rate": 25600,
    "sample_size": 50000,
    "scheduler_enabled": true,
    "hearthbeat_interval_seconds": 1800,
    "min_trigger_interval_seconds": 300,
    "relative_change": 0.1,
    "absolute_change": 0.05
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
  "device_mac": "CA:B8:41:XX:XX:XX",
  "device_config": {
    "accelerometer_range": 16,
    "sampling_rate": 25600,
    "sample_size": 50000,
    "scheduler_enabled": true,
    "hearthbeat_interval_seconds": 1800,
    "min_trigger_interval_seconds": 300,
    "relative_change": 0.1,
    "absolute_change": 0.05
  },
  "status": "Device config updated"
}
```

 </td>
</tr>
<tr>
 <td>
 Wired Pro
 </td>
 <td>
 <b> sensemore/&lt;GatewayMac&gt;/device/&lt;GatewayMac&gt;/config/set/rejected</b>
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
  "status": "Invalid payload! 'hearthbeat_interval_seconds' is missing or invalid"
}
```

 </td>
</tr>
</table>

❗️ Bu taşımada `scheduler_enabled` bir JSON **boolean** olmalıdır.

### <span style="color: rgb(240,95,34)">Ölçüm</span> :id=measurement

Wired Pro, otomatik ölçümleri [akıllı ölçüm stratejisi](#measurement-strategy) ile başlatır. Ayrıca daha önce belirlenmiş yapılandırmaya göre Sensemore Lake platformundan, MQTT üzerinden ve [HTTP](#-http-measurement) üzerinden manuel ölçüm de kabul eder. MQTT ölçüm konuları aşağıdaki gibidir.

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

Birimler: `grms_*`, `peak_*`, `peak_to_peak_*`, `mean_*` **g** cinsindendir; `vrms_*` **mm/s**
cinsindendir; `temperature` **°C** cinsindendir. `calibrated_sampling_rate`, ivmeölçerin ölçülen
gerçek ODR değeridir ve ham sinyali yorumlarken kullanılması gereken değerdir — sensörün dahili
frekans ayarı nedeniyle istenen `sampling_rate` değerinden farklıdır.

Cihazın kendi ürettiği ölçüm UUID'leri `WR-SMRT-` (akıllı ölçüm) ve `WR-TRIG-`
([HTTP tetikleme](#-trigger-measurement)) öneklerini kullanır.

## <span style="color: rgb(240,95,34)">HTTP Entegrasyonu</span> :id=http-integration

Wired Pro, ayarlarını görüntülemek veya değiştirmek için HTTP uç noktaları sunar.

Bazı uç noktalar başlıkta bir kimlik doğrulama tokenı gerektirir. Başlıkta token gerektiren uç noktalar 🔐 simgesiyle işaretlenmiştir.
Bu token, aşağıda gösterildiği gibi Giriş uç noktası kullanılarak elde edilir.

### <span style="color: rgb(240,95,34)">Giriş</span>

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Content-Type</th>
<th>Request</th>
<th>Response</th>
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
  "password": "<DEVICE_PASSWORD>"
}
```

</i>
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

❗️ Token, **`POST /login` isteğinin yanıt gövdesinde** döner. `GET /login` diye bir
uç nokta yoktur. Aynı anda yalnızca tek bir token geçerlidir — tekrar giriş yapmak önceki tokenı
geçersiz kılar; `/logout` ve `/change_password` de aynı etkiyi yapar.

#### <span style="color: rgb(240,95,34)">Tokenınızı başlığa ekleyin</span>

Kimlik doğrulama tokenı Giriş uç noktası aracılığıyla alındıktan sonra, 🔐 uç noktalarına yapılan her HTTP isteğinin başlığına aşağıdaki gibi eklenmelidir.

```
Authorization: CLjziyTeTzlMsv100mvgkxnTQl1nGYXpQvsIStAW16WrMjxzLvhNTOGhcFFzU38mT8sHKFhxBOm3309qxSmzKIHJux3rUbjVTkywmayA1O05hKaQn9jlY99YMmp1NorF
```

### <span style="color: rgb(240,95,34)">🔐 Çıkış</span>

Mevcut tokenı geçersiz kılar.

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
<i>No body</i>
</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">Bilgi</span>

Cihaz hakkındaki temel bilgiler, **Yazılım Sürümü** dahil, aşağıdaki HTTP uç noktası kullanılarak alınabilir. Token gerektirmeyen tek uç nokta budur.

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
  "mac_address": "CA:B8:41:XX:XX:XX",
  "version": "3.1.2",
  "is_network_connected": true,
  "is_internet_connected": true
}
```

</i>
</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">🔐 Şifre Değişimi</span>

Cihazın HTTP ve web yapılandırma arayüzü şifresi aşağıdaki HTTP uç noktası kullanılarak değiştirilebilir. İşlem başarılı olduğunda mevcut token geçersiz kılınır ve yeniden giriş yapılması gerekir.

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

İstek:

```json
{
  "old_password": "<CURRENT_PASSWORD>",
  "new_password": "12345678"
}
```

Yanıt:

```json
{
  "success": true
}
```

</i>
</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">🔐 NTP</span> :id=-ntp

Zaman bilgisi, Wired Pro tarafından gönderilen ölçüm mesajlarının bir parçasıdır. NTP yapılandırması aşağıdaki HTTP uç noktası kullanılarak alınabilir veya değiştirilebilir.

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
  "sntp_server": "pool.ntp.org"
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

İstek:

```json
{
  "sntp_server": "pool.ntp.org"
}
```

Yanıt:

```json
{
  "success": true
}
```

 </i>
 </td>
</tr>
</table>

❗️ Yalnızca ana bilgisayar adı — yukarıdaki [NTP](#ntp) notuna bakınız.

### <span style="color: rgb(240,95,34)">🔐 Havadan Yazılım Güncellemesi (OTA)</span>

Yazılım ikili dosyasını doğrudan cihaza yükler. İstek gövdesi ham `.bin` dosyasıdır.
Cihaz, yanıt verdikten yaklaşık 3 saniye sonra yeniden başlar.

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
<i>Ham yazılım ikili dosyası. <code>{"success": true}</code> yanıtı döner. 10 saniye içinde
yeni bir parça gelmezse aktarım <code>408</code> ile iptal edilir.</i>
</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">🔐 Yeniden Başlatma</span>

Wired Pro aşağıdaki uç nokta kullanılarak yeniden başlatılabilir.

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
<b> /restart</b>
</td>
<td>
application/json
</td>
<td>
<i>Gövde yoktur. Cihaz anında yeniden başladığından bağlantı yanıt gövdesi olmadan kapanır.</i>
</td>
</tr>
</table>

❗️ Bu uç nokta GET değil **POST**'tur.

### <span style="color: rgb(240,95,34)">🔐 Ölçüm Yükleme URL'si</span> :id=-measurement-upload-url

Wired Pro, ölçüm yüklemelerini kendisi yönetir: meta verileri MQTT üzerinden yayınlar, sinyal ikili dosyalarını ise HTTPS ile aktarır.
Varsayılan ikili dosya yükleme URL'si _[https://core.sensemore.io/measurement](https://core.sensemore.io/measurement)_ olup aşağıdaki uç nokta kullanılarak alınabilir veya değiştirilebilir.

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

İstek:

```json
{
  "url": "https://core.sensemore.io/measurement"
}
```

Yanıt:

```json
{
  "success": true
}
```

 </i>
 </td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">🔐 HTTP Ölçüm Yapılandırması</span> :id=-http-measurement-configuration

Wired Pro'nun ölçüm yapılandırması aşağıdaki uç nokta ile görüntülenebilir veya değiştirilebilir. Alan anlamları ve kısıtlar [Ölçüm Stratejisi](#measurement-strategy) bölümünde belgelenmiştir.

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
  "scheduler_enabled": 1,
  "hearthbeat_interval_seconds": 1800,
  "min_trigger_interval_seconds": 300,
  "relative_change": 0.1,
  "absolute_change": 0.05
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

İstek — sekiz alanın tamamı zorunludur:

```json
{
  "accelerometer_range": 16,
  "sampling_rate": 25600,
  "sample_size": 50000,
  "scheduler_enabled": 1,
  "hearthbeat_interval_seconds": 1800,
  "min_trigger_interval_seconds": 300,
  "relative_change": 0.1,
  "absolute_change": 0.05
}
```

Yanıt:

```json
{
  "success": true
}
```

 </i>
 </td>
</tr>
</table>

❗️ Bu taşımada `scheduler_enabled` bir JSON **sayı** (`0`/`1`) olmalıdır.

### <span style="color: rgb(240,95,34)">🔐 HTTP Ölçümü</span> :id=-http-measurement

Kayıtlı mevcut yapılandırmayı kullanarak tek bir ölçüm alır ve meta verisini yanıt gövdesinde
döndürür. Bu **yerel** bir işlemdir: MQTT'ye yayın yapmaz ve ham sinyal ikili dosyasını yüklemez.
Tam bir bulut turu için [`/trigger-measurement`](#-trigger-measurement) kullanın.

İstek, ölçüm tamamlanana kadar bloklanır; `sample_size` 50000 ve `sampling_rate` 25600 değerlerinde
bu birkaç saniye sürer. İstemci zaman aşımı sürenizi buna göre ayarlayın.

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Content-Type</th>
<th>Request</th>
<th>Response</th>
</tr>
<tr>
<td>
POST
</td>
<td>
<b> /measure</b>
</td>
<td>
application/json
</td>
<td>
<i>Gövde gerekmez. Boş bir JSON nesnesi <code>{}</code> gönderin.</i>
</td>
<td>
<i>

MQTT `metadatas` yükü ile aynı biçimdeki ölçüm meta verisi:

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

</i>
</td>
</tr>
</table>

### <span style="color: rgb(240,95,34)">🔐 Tetiklemeli Ölçüm</span> :id=-trigger-measurement

Anında bir ölçüm alır ve **tam yükleme hattını** çalıştırır — MQTT ölçüm konularında `accepted`,
`metadatas` ve `done` yayınlar ve ham sinyal ikili dosyasını yapılandırılmış
[ikili dosya URL'sine](#-measurement-upload-url) yükler — tıpkı zamanlanmış bir akıllı ölçümün
yapacağı gibi.

❗️ **Bu uç nokta, yan etki olarak akıllı ölçümü devre dışı bırakır.** Ölçümü almadan
önce `scheduler_enabled` değerini false yapar (diğer dört akıllı ölçüm parametresini korur), bu
nedenle siz [`/configuration`](#-http-measurement-configuration) veya
[`config/set`](#mqtt-measurement-configuration) MQTT konusu üzerinden tekrar etkinleştirene kadar
periyodik ölçümler durur.

Cihaz ölçüm UUID'sini `WR-TRIG-<14 rastgele karakter>` biçiminde kendisi üretir.
Sonucu izlemek için `sensemore/<GatewayMac>/device/<GatewayMac>/measure/+/#` konusuna abone olun.

İstek, ölçüm **ve** ikili dosya yüklemesi boyunca bloklanır — yavaş bir bağlantıda büyük örnek
boyutlarında onlarca saniye sürebileceğini hesaba katın.

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Content-Type</th>
<th>Request</th>
<th>Response</th>
</tr>
<tr>
<td>
POST
</td>
<td>
<b> /trigger-measurement</b>
</td>
<td>
application/json
</td>
<td>
<i>Gövde gerekmez. Boş bir JSON nesnesi <code>{}</code> gönderin.</i>
</td>
<td>
<i>

```json
{
  "success": true
}
```

Hata durumunda cihaz `500` ve bir hata nesnesi döndürür:

```json
{
  "success": false,
  "error": "Failed to trigger measurement and upload"
}
```

</i>
</td>
</tr>
</table>

## <span style="color: rgb(240,95,34)">RS485 Entegrasyonu</span> :id=rs485-integration

RS485 modunda Wired Pro, yarı çift yönlü bir RS485 veri yolunda **slave**'dir ve trafiği hiçbir
zaman kendisi başlatmaz. Master, ağ geçididir. İletişim, aşağıda anlatılan **EasyCom** çerçeveleme
protokolünü kullanır. Bu modda Wi-Fi, MQTT ve HTTP uç noktaları devre dışıdır.

Cihazı modlar arasında geçirmek için veri yolu üzerindeki
[Set Operational Mode](#0x0a-set-operational-mode) fonksiyonunu ya da Wi-Fi yapılandırma
sayfasındaki mod seçicisini kullanın. Cihaz seçimi kalıcı olarak saklar ve seçilen modda yeniden başlar.

### <span style="color: rgb(240,95,34)">Elektriksel ve UART Ayarları</span>

| Parametre                 | Değer                                                              |
| ------------------------- | ------------------------------------------------------------------ |
| Fiziksel katman           | RS485, yarı çift yönlü, 2 telli                                    |
| Çerçeve formatı           | 8 veri biti, parity yok, 1 stop biti (8N1)                         |
| Akış kontrolü             | Yok (driver enable cihaz tarafından yönetilir)                     |
| Varsayılan baud hızı      | **921600**                                                   |
| Desteklenen baud hızları  | 9600, 19200, 38400, 57600, 115200, 230400, 460800, 921600, 1000000 |
| Veri yolu sonlandırma     | Yazılımdan anahtarlanabilir 120 Ω direnç, varsayılan olarak**kapalı** |

Hem baud hızı hem de sonlandırma direncinin durumu yeniden başlatmalar arasında korunur.
Sonlandırmayı yalnızca veri yolunun fiziksel iki ucundaki cihazlarda etkinleştirin.

### <span style="color: rgb(240,95,34)">Çerçeve Formatı</span>

Her istek ve her yanıt, taşıdığı yük miktarından bağımsız olarak **sabit 256 baytlık bir
çerçevedir**. Çok baytlı tüm tam sayılar **little-endian**'dır. Veri alanı sıfırlarla doldurulur.

| Ofset  | Boyut | Alan          | Açıklama                                              |
| ------ | ----- | ------------- | ----------------------------------------------------- |
| 0      | 1     | `preamble`  | Her zaman`0xA3`                                     |
| 1      | 6     | `address`   | İsteklerde hedef MAC, yanıtlarda gönderen MAC         |
| 7      | 1     | `status`    | Yanıt durumu. İsteklerde yok sayılır (`0x00` gönderin) |
| 8      | 1     | `function`  | Fonksiyon kodu. Yanıtta aynen geri döner              |
| 9      | 1     | `data_size` | `data` içindeki anlamlı bayt sayısı, 0–243          |
| 10     | 243   | `data`      | Yük, 243 bayta kadar sıfırlarla doldurulur            |
| 253    | 2     | `crc16`     | Aşağıya bakınız                                       |
| 255    | 1     | `postamble` | Her zaman`0x51`                                     |

❗️ Referans C `package_t` yapısı, sonunda **yerel durum olan ve hatta gönderilmeyen**
bir `is_broadcast` bayrağı taşır. Hatta `sizeof(package_t)` değil, tam olarak 256 bayt yazın.

#### Adresleme

`address`, hedef Wired Pro'nun hat sırasındaki 6 baytlık MAC adresidir. MAC, cihaz etiketinde
yazılıdır ve aynı zamanda Wi-Fi modunda kullanılan `<GatewayMac>` değeridir.

`FF:FF:FF:FF:FF:FF` broadcast adresi kabul edilir: veri yolundaki her cihaz isteği yürütür ancak
**hiçbir cihaz yanıt göndermez**. Bunu yalnızca yanıt beklenmeyen komutlar için kullanın. Farklı
bir MAC'e adreslenmiş çerçeve sessizce yok sayılır.

#### CRC

`crc16`, ofset 1'den başlayan **252 baytı** kapsar — `address`, `status`, `function`,
`data_size` ve sıfır dolgusu dahil 243 baytlık `data` alanının tamamı. Preamble, CRC alanının
kendisi ve postamble hariçtir.

Algoritma; 0x1021 polinomlu (yansıtılmış: 0x8408), başlangıç değeri 0x0000 ve son XOR değeri
0xFFFF olan yansıtılmış (reflected) bir CRC-16'dır:

```c
uint16_t easycom_crc16(const uint8_t *data, uint32_t size) {
    uint16_t crc = 0x0000;                       /* note: init 0, not 0xFFFF */
    for (uint32_t i = 0; i < size; i++) {
        crc = crc16_le_table[(crc ^ data[i]) & 0xFF] ^ (crc >> 8);
    }
    return ~crc;
}
/* called as: pkg.crc16 = easycom_crc16(((uint8_t *)&pkg) + 1, 252); */
```

`crc16_le_table`, standart 256 girdili yansıtılmış CCITT tablosudur (`0x0000, 0x1189, 0x2312, 0x329b, ...`).

#### Master işlem kuralları

1. 256 baytlık istek çerçevesinin tamamını yazın.
2. 256 baytlık yanıtı okuyun. Referans master **250 ms**'lik bir UART okuma zaman aşımı kullanır.
3. Preamble, postamble ve CRC'yi doğrulayın. Herhangi bir uyuşmazlıkta **isteğin tamamını
   tekrarlayın** — referans master, zaman aşımı bildirmeden önce **5 kez**e kadar dener.
4. Yanıt, isteğin `function` kodunu aynen geri döndürür ve `address` alanında **cihazın kendi
   MAC adresini** taşır; master hangi slave'in yanıt verdiğini böyle anlar.

Cihaz, gönderim yapmadan önce UART alma tamponunu boşaltır; bu nedenle master, bir önceki isteğin
yanıtını okumadan yeni bir istek göndermemelidir.

Veri yolu **60 saniye** boyunca tamamen boş kalırsa cihaz UART sürücüsünü yeniden yükler. Bu durum
master açısından şeffaftır, ancak tam o anda gönderilen bir çerçeve kaybolabilir ve 3. adımdaki
yeniden deneme ile telafi edilir.

### <span style="color: rgb(240,95,34)">Yanıt Durum Kodları</span>

| Değer    | Ad                           | Anlamı                                                                                       |
| -------- | ---------------------------- | -------------------------------------------------------------------------------------------- |
| `0x00` | `RESPONSE_OK`              | İstek tamamlandı                                                                             |
| `0x01` | `RESPONSE_ERROR`           | İstek başarısız — geçersiz parametreler ya da işlem hata verdi                              |
| `0x02` | `RESPONSE_BUSY`            | Bir ölçüm devam ediyor veya cihaz dahili kilidini 10 ms içinde alamadı                       |
| `0x03` | `RESPONSE_NOT_FOUND`       | Ayrılmış                                                                                     |
| `0x04` | `RESPONSE_INVALID_ARG`     | Ayrılmış                                                                                     |
| `0x05` | `RESPONSE_NOT_IMPLEMENTED` | Bilinmeyen fonksiyon kodu                                                                    |
| `0x06` | `RESPONSE_TIMEOUT`         | Ayrılmış                                                                                     |
| `0xFF` | `RESPONSE_CRC_ERROR`       | Ayrılmış                                                                                     |

❗️ `RESPONSE_BUSY`, cihaz meşgulken gelen düzgün biçimli bir istek için de döner.
Bunu bir hata değil, "daha sonra tekrar dene" olarak değerlendirin.

### <span style="color: rgb(240,95,34)">Fonksiyon Kodları</span>

| Kod      | Fonksiyon                                         | İstek yükü                                | Yanıt yükü       |
| -------- | ------------------------------------------------- | ----------------------------------------- | ---------------- |
| `0x00` | [Restart](#0x00-restart)                           | —                                        | —               |
| `0x01` | [Ping](#0x01-ping)                                 | 4 bayt                                    | 8 bayt           |
| `0x02` | [Measure](#0x02-measure)                           | 8 bayt                                    | —               |
| `0x03` | [Get Chunk](#0x03-get-chunk)                       | 8 bayt                                    | 224 bayt         |
| `0x04` | [Get Metadata](#0x04-get-metadata)                 | 32 bayt                                   | 40 bayt          |
| `0x05` | Enter Factory                                     | *Sensemore üretim kullanımına ayrılmıştır* |                  |
| `0x06` | [Firmware Begin](#0x06-firmware-begin)             | 4 bayt                                    | —               |
| `0x07` | [Firmware Package](#0x07-firmware-package)         | 205 bayt                                  | 4 bayt           |
| `0x08` | [Set Baud Rate](#0x08-set-baud-rate)               | 4 bayt                                    | —               |
| `0x09` | [Set RS485 Resistor](#0x09-set-rs485-resistor)     | 1 bayt                                    | —               |
| `0x0A` | [Set Operational Mode](#0x0a-set-operational-mode) | 1 bayt                                    | —               |

Aşağıdaki tüm yük yapıları `__attribute__((packed))` ve little-endian'dır.

#### 0x00 Restart

Yanıt gönderildikten yaklaşık 1 saniye sonra cihazı yeniden başlatır.

```c
/* request  */ struct { } restart_request;
/* response */ struct { uint32_t timestamp; } restart_response;   /* not populated — ignore */
```

#### 0x01 Ping

Sağlık kontrolü ve yazılım sürümü sorgusu. Master, ölçümün tamamlanıp tamamlanmadığını da bu
yolla yoklar: veri toplama sürerken durum `RESPONSE_BUSY` olur.

```c
/* request */
struct {
    int32_t timestamp;          /* currently ignored by the device */
} ping_request;

/* response */
struct {
    struct { uint8_t major, minor, patch; } version;
    uint32_t timestamp;         /* device uptime in ms */
    uint8_t  rs485_resistor_enabled;
} ping_response;
```

❗️ Referans başlık dosyası `ping_request.timestamp` alanını `long int` olarak tanımlar;
bu, 32 bitlik cihazda 4 bayttır. 64 bitlik bir master bunu **`int32_t`** olarak göndermelidir,
aksi hâlde çerçeve yerleşimi uyuşmaz.

Durum: boştayken `RESPONSE_OK`, ölçüm sürerken `RESPONSE_BUSY`.

#### 0x02 Measure

Verilen parametrelerle bir veri toplama başlatır. **Hemen döner** — toplama asenkron olarak
çalışır. Durum `RESPONSE_BUSY` olmaktan çıkana kadar [Ping](#0x01-ping) ile yoklayın, ardından
sonuçları okuyun.

```c
/* request */
struct {
    uint32_t sample_size;         /* 100 – 120000 samples per axis */
    uint16_t sampling_rate;       /* 800, 1600, 3200, 6400, 12800, 25600 Hz */
    uint8_t  accelerometer_range; /* 2, 4, 8, 16 g */
    uint8_t  measurement_type;    /* reserved, send 0 */
} start_measurement_request;

/* response */
struct { } start_measurement_response;
```

❗️ Alan sırasına dikkat edin — `sample_size` **ilk** gelir. Aralık dışı parametreler
`RESPONSE_ERROR` ile reddedilir.

Toplama süresi yaklaşık `sample_size / sampling_rate` saniyedir; buna birkaç saniyelik flash yazma
ve sinyal işleme ek yükü eklenir.

#### 0x03 Get Chunk

Son ölçümde kaydedilen ham sinyalin bir dilimini okur.

```c
/* request */
struct {
    uint32_t offset;    /* byte offset into the raw signal */
    uint32_t size;      /* bytes to read, max 220 */
} get_chunk_request;

/* response */
struct {
    uint32_t size;      /* not populated — use the size you requested */
    uint8_t  data[220];
} get_chunk_response;
```

❗️ **`size` 220'yi aşmamalıdır** (`MAX_CHUNK_SIZE`). Cihaz bu sınırı doğrulamaz;
daha büyük bir istek yanıt çerçevesini bozar.

❗️ Yanıttaki `size` alanı mevcut yazılım tarafından doldurulmaz. Master zaten kaç
bayt istediğini bilir — bu değeri kullanın ve `data` alanını yanıt yükünün 4. ofsetinden itibaren
okuyun.

**Ham sinyal yerleşimi.** Kayıt `sample_size × 6` bayttır: X, Y, Z sırasıyla araya yerleştirilmiş
üç adet **işaretli 16 bit little-endian** değerden oluşan `sample_size` adet çerçeve.

```
offset 0    2    4    6    8   10   12  ...
       x0   y0   z0   x1   y1   z1   x2 ...
```

Ham sayacı g'ye çevirmek için `accelerometer_range × 2 / 65536` ile çarpın — örn. ±16 g'de
0.00048828125 g/LSB. Zaman tabanı olarak istenen `sampling_rate` değerini değil, meta verideki
`calibrated_sampling_rate` değerini kullanın.

#### 0x04 Get Metadata

Son ölçümden ada göre hesaplanmış tek bir telemetri değerini okur.

```c
/* request */
struct {
    char name[32];      /* zero-padded, e.g. "grms_z" */
} metadata_request;

/* response */
struct {
    char   name[32];    /* echoed */
    double value;
} metadata_response;
```

Geçerli adlar, [MQTT Ölçüm](#measurement) bölümünde belgelenen meta veri nesnesinin
anahtarlarıdır — `sum_*`, `mean_*`, `peak_*`, `peak_to_peak_*`, `clearance_*`, `crest_*`,
`vrms_*`, `grms_*`, `kurtosis_*`, `skewness_*` (her biri `_x`, `_y` veya `_z` sonekiyle) ve
ayrıca `unixtimestamp`, `temperature`, `calibrated_sampling_rate`, `sampling_rate`,
`sample_size`, `accelerometer_range` ve `measurement_buffer_size`.

Bilinmeyen bir ad `RESPONSE_ERROR` döndürür.

#### 0x06 Firmware Begin

Güncelleme bölümünü, verilen boyuttaki bir yazılım imajı için hazırlar. Herhangi bir
[Firmware Package](#0x07-firmware-package) çerçevesinden önce gönderilmelidir.

```c
/* request  */ struct { uint32_t size; } firmware_begin_request;
/* response */ struct { } firmware_begin_response;
```

#### 0x07 Firmware Package

Yazılım imajının 200 baytlık bir dilimini yazar. İmajın tamamı aktarılana kadar sırayla gönderin;
yazma tamamlandığında cihaz yeni imajla yeniden başlar.

```c
/* request */
struct {
    uint32_t offset;
    uint8_t  data[200];
    uint8_t  size;      /* note: after data, not before */
} firmware_package_request;

/* response */
struct { uint32_t timestamp; } firmware_package_response;
```

#### 0x08 Set Baud Rate

Veri yolu baud hızını değiştirir ve kalıcı olarak saklar.

```c
/* request  */ struct { uint32_t baudrate; } set_baudrate_request;
/* response */ struct { } set_baudrate_response;
```

❗️ **Cihaz, yanıtı göndermeden önce baud hızını değiştirir.** Master, isteği eski
hızda göndermeli, ardından onayı okuyabilmek için kendi UART'ını hemen yeni hıza göre yeniden
yapılandırmalıdır. Master onayı kaçırsa bile cihaz zaten yeni hızda çalışıyordur — eski hızda
tekrar denemek yerine yeni hızda ping atarak toparlanın.

Desteklenmeyen bir değer hızı değiştirmez ve `RESPONSE_ERROR` döndürür.

#### 0x09 Set RS485 Resistor

Kart üzerindeki 120 Ω veri yolu sonlandırma direncini etkinleştirir veya devre dışı bırakır.
Yeniden başlatmalar arasında korunur.

```c
/* request  */ struct { uint8_t rs485_resistor_enabled; } set_rs485_resistor_request;
/* response */ struct { } set_rs485_resistor_response;
```

#### 0x0A Set Operational Mode

Cihazı Wi-Fi ve RS485 modu arasında geçirir. Kalıcıdır; cihaz seçilen modda yeniden başlar.

```c
/* request */
struct {
    uint8_t mode;       /* 0 = Wi-Fi mode, 1 = RS485 mode */
} set_operational_mode_request;

/* response */
struct { } set_operational_mode_response;
```

❗️ `mode = 0` göndermek cihazı RS485 veri yolundan çıkarır. Bu noktadan sonra cihaza
yalnızca Wi-Fi üzerinden erişilebilir.

### <span style="color: rgb(240,95,34)">Tipik Ölçüm Dizisi</span>

```
Master                                   Wired Pro
  |-- 0x01 Ping ------------------------->|
  |<-- OK, version 3.1.2 -----------------|

  |-- 0x02 Measure (50000, 25600, 16) --->|
  |<-- OK ---------------------------------|   acquisition starts

  |-- 0x01 Ping ------------------------->|
  |<-- BUSY -------------------------------|   repeat until OK
  |-- 0x01 Ping ------------------------->|
  |<-- OK ---------------------------------|

  |-- 0x04 Get Metadata "sample_size" --->|
  |<-- OK, 50000 --------------------------|
  |-- 0x04 Get Metadata "grms_z" -------->|
  |<-- OK, 0.004284 -----------------------|   repeat per telemetry

  |-- 0x03 Get Chunk (offset 0, 220) ---->|
  |<-- OK, 220 bytes ----------------------|
  |-- 0x03 Get Chunk (offset 220, 220) -->|
  |<-- OK, 220 bytes ----------------------|   repeat until sample_size*6 bytes read
```
