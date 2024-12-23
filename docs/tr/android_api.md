# <span style="color: rgb(240,95,34)">1.1. Giriş</span>

SensemoreApi, geliştiricilerin kendi android uygulamalarını Sensemore ürünlerine entegre etmelerini sağlayan bir kütüphanedir. Şu anki ana ürün "Sensemore Infinity"dir. Bu kütüphaneyi kullanarak Sensemore Infinity'i rahatlıkla tarayabilir, bağlayabilir ve ölçüm yapabilirsiniz. Bu kütüphaneye sahip olmak istiyorsanız, lütfen [**hello@sensemore.io**](mailto:hello@sensemore.io) adresinden iletişime geçiniz.

Ayrıca okuma kısmını atlayabilir ve API'nin temel kullanımlarını anlamak için örnek uygulamaya göz atabilirsiniz.

## <span style="color: rgb(240,95,34)">1.2. Başlangıç</span>

### <span style="color: rgb(240,95,34)">1.2.1. Gereksinimler</span>

Bu kütüphaneleri app.gradle dosyasındaki bağımlılıklarınıza dahil ettiğinizden emin olunuz:

SensemoreApi, async işlemlerini yönetmek için reactivex modüllerini kullanır. **API seviyesi 24'ten büyük olmalıdır.**

```gradle
implementation 'io.reactivex.rxjava2:rxandroid:2.1.1' //manage asyn operations
implementation "com.polidea.rxandroidble2:rxandroidble:1.11.0" //reactive BLE dependency
implementation group: 'com.fasterxml.jackson.dataformat', name: 'jackson-dataformat-csv', version: '2.9.8'//JSON parse, export
implementation 'net.sf.opencsv:opencsv:2.3'//csv export
```

### <span style="color: rgb(240,95,34)">1.2.2. API Kurulumu</span>

SensemoreApi, .aar dosyası olarak verilecektir. Bu sebeple, kütüphane boyutunu ve yönetimini temiz tutmak için yukarıdaki bağımlılıkları tanımlamanız gerekmektedir. **File > New > New Module, click "Import .JAR/.AAR Package"** modül tipine tıklayarak .aar dosyasını projenize aktarmalısınız. Daha sonra kütüphane dosyasının yolunu seçiniz.

Projenizi senkronize edin ve oluşturun. Son olarak, app.gradle dosyanızdaki bağımlılığı tanımlayın.

```gradle
implementation project(":sensemoreapi")
```
### <span style="color: rgb(240,95,34)">1.2.3. İzinler</span>

SensemoreApi Bluetooth Düşük Enerji(BLE) kullandığından, Bluetooth ve Konumlar hizmetlerine erişim için izin istemelisiniz.

_AndroidManifest.xml_
```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```
İzin isteme
```java
requestPermissions(new String[]{ Manifest.permission.BLUETOOTH, Manifest.permission.ACCESS_FINE_LOCATION}, PERMISSIONS);
```


# <span style="color: rgb(240,95,34)">2. Kullanım</span>

API örneğinizi ```api = SensemoreApi.Build(this);``` olarak ayarlayınız, sonrasında hazırsınız. Hemen hemen bütün API yöntemleri, durumları işlemek için reaktif tüketicileri kullanır.

### <span style="color: rgb(240,95,34)">2.0.1. Tarama</span>

Tarama yöntemi, BLE taramasını Sensemore ürünlerinin isimlerinin filtresiyle yapmaktır. Böylelikle yalnızca Sensemore ürünlerine erişebilirsiniz. Tarama, bağlantı durumu değiştikten sonra silinir.

```java
 api.Search(scanResult -> {
            Log("Scan result " + scanResult.DeviceName + ", mac:" + scanResult.MacAddress + ", rssi:" + scanResult.Rssi);
        }, throwable -> {
            Log("Error scan", throwable);
        });
```

### <span style="color: rgb(240,95,34)">2.0.2. Bağlan/Bağlantıyı Kes</span>

Bağlanmak için geçerli bir MAC adresi ve parametre olarak durum geri çağırması (state callback) gerekir. Geçersiz MAC adresi uygulamayı bozar. Cihazla bağlantınızı kesmek için api.Disconnect() yöntemini çağırmanız yeterlidir. ```api.Disconnect()``` olayları silinecektir.

```java
 api.Connect(macAddress.getText().toString(), connectCallbacks);
 
  ConnectCallbacks connectCallbacks = new ConnectCallbacks() {
        @Override
        public void onConnecting() {
            Log.i("ON_CONNET", "Connecting");
        }

        @Override
        public void onConnected() {
            Log("onConnected");
        }

        @Override
        public void onDisconnected() {
            Log("onDisconnected");
        }

        @Override
        public void onDisconnecting() {
            Log("onDisconnecting");
        }

        @Override
        public void onError(Throwable throwable) {
            Log("error connection", throwable);
        }
    };
```

### <span style="color: rgb(240,95,34)">2.0.3. Cihaz İstatistiklerini Okuma</span>

Cihaz istatistikleri dört çeşit bilgiyi barındırır.

- Sıcaklık, cihazın iç sıcaklığı
- Pil, kalan pil voltajı
- Kalibre edilmiş örnekleme oranı, son ölçüm işleminde hesaplanan örnekleme oranı
- Alınan sinyal gücü göstergesi (RSSI), Bluetooth bağlanırlık metriği

```java
 api.ReadDeviceStats(deviceStats -> {
                    Log("Device stats, Temperature:" + deviceStats.temperature + ", battery" + deviceStats.battery + ", Calibrated Sampling rate:" + deviceStats.calibratedSamplingRate + ", Rssi:" + deviceStats.rssi);
                },
                throwable -> {
                    Log("Error device stats", throwable);
                });
```

## <span style="color: rgb(240,95,34)">2.1. Ölçüm</span>

İki tip ölçüm vardır, Toplu (Batch) ve Akış (Stream).

Toplu ölçümde cihaza ölçüm komutu gönderilir ve başarıyla tamamlandıktan sonra ölçüm verileri okunur.

Akış ölçümünde ölçüm parçaları anında geri çağırmaya aktarılır. Akış ölçümü yalnızca örnekleme oranı 800 Hz ve altı olan profiller tarafından gerçekleştirilir.

### <span style="color: rgb(240,95,34)">2.1.1. Biçim İmi</span>

Ölçümlerinizi referanslarla takip etmek isteyebilirsiniz. Referansınız olarak biçim imlerini kullanın.

### <span style="color: rgb(240,95,34)">2.1.2. Profil</span>

Özellikler:

| UYARI: Örnek boyutu ve örnekleme oranını ayarlarken dikkatli olmalısınız. Aralarındaki bağıntı ölçüm süresini belirleyecektir (ÖrnekBoyutu/ÖrneklemeOranı). Örnek boyutu için çok büyük bir değer atarsanız çok uzun bir ölçüme neden olabilirsiniz ve bu, cihazın pilini büyük ölçüde tüketir. |

- Ad
  - Profil, ölçüm konfigürasyonlarıyla ilgili bilgileri tutar. Profilebir ad verebilir ve daha fazla kullanım için saklayabilirsiniz.
- ÖrnekBoyutu
  - Başarılı bir ölçümden sonra eksenlerin toplamı için kaç örneğin alınacağını tanımlar.
- ÖrneklemeOranı
- İvmeölçerAralığı
  - İvmeölçer sensörünün hassasiyetini tanımlar.
- SensörSeçimi
  - SensemoreInfinity'de sinyal ölçümü için yalnızca İvmeölçer bulunur. Daha fazla kullanım için tanımlanmıştır.

Varsayılan yapılandırıcıdan profil parametreleri oluşturmayın. Önceden tanımlanmış örnekleri aşağıdaki gibi kullanabilirsiniz

```java
String name = "Example Profile";
int sampleSize = 10000;
SamplingRate samplingRate = SamplingRate.Rate800Hz;
SensorSelection sensorSelection = SensorSelection.Accelerometer;
Accelerometer accelerometerRange = Accelerometer.Range2G;

Profile profile= new Profile(name, sampleSize, samplingRate, accelerometerRange, sensorSelection);
```

### <span style="color: rgb(240,95,34)">2.1.3. Toplu Ölçüm</span>

Toplu ölçüm alabilmek için profil tanımlanması gerekmektedir. Profili tanımladıktan sonra profili ve biçim imlerini Toplu Ölçüm yöntemine geçirmeniz yeterlidir.
```java
  api.BatchMeasurement(profile, tags, () -> {
                    Log("Data reading started");
                },
                measurement -> {
                    Log("Measurement Done Reading");
                    // it is good time to read device stats

                },
                throwable -> {
                    Log("Error", throwable);
                });
```

Sensemore cihazlarını kalibre etmenize gerek yoktur. Sensemore cihazları, ölçüm sırasında kalibre edilmiş örnekleme oranlarını anında hesaplar. Başarılı ölçümden sonra, kalibre edilmiş örnekleme oranını [ReadDeviceStats](#read-device-stats) yönteminden okuyabilirsiniz.

### <span style="color: rgb(240,95,34)">2.1.4. Akış Ölçümü</span>

Akış ölçümü alabilmek için profil tanımlanması gerekmektedir. Profili tanımladıktan sonra profili ve biçim imlerini Akış Ölçümü yöntemine geçirmeniz yeterlidir.

| UYARI: İhtiyacınız olmadığında akış ölçümünü durdurmayı unutmayın. İletişimi durduran herhangi bir zaman aşımı denetimi bulunmamaktadır. |

```java
api.StreamMeasurement(profile, tags, streamChunk -> {
                    Log(streamChunk.accelerometerX +
                     "," + streamChunk.accelerometerY +
                      "," + streamChunk.accelerometerZ);
                },
                throwable -> Log("Stream error", throwable));
throwable -> Log("Stream error", throwable));
```

Durdurma:
```java
 api.StopStream(measurement -> {
     //mirikimli ölçüm veririsini tutar
});
```

## <span style="color: rgb(240,95,34)">2.2. Yardımcılar</span>

### <span style="color: rgb(240,95,34)">2.2.1. Ayrıştırıcı</span>
Ayrıştırıcı yöntemleri aşağıda listelenmiştir
- `measurement.ToJSON()`
- `measurement.ParseJSON()`
- `measurment.ConvertToCSV()`