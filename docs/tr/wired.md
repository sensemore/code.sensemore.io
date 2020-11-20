# **Wired v1.0.2**
Wired kullanım kılavuzu
## 1. Wired cihaz durumları ve LED göstergesi

Wired cihazın çalışma durumu üzerinde bulunan LED gösterge ile takip edilebilir.

Cihaz ışığı kısa veya uzun yanabilir.
Kısa: LED 250 ms açık, 250 ms kapalı

Uzun: LED 1000 ms açık, 250 ms kapalı.

Tablo 1 : Wired LED belirteci ve cihazın anlık durumu

| **LED süresi** | **LED rengi** | **LED durumu** | **Cihaz durumu** |
| --- | --- | --- | --- |
| 1 saniye | Sarı | Sabit | Cihaz açılış |
| 6 defa | Sarı | Kısa | Uygulamaya geçmeden önce cihaz hazırlanıyor |
| İşlem olmadığında | Yeşil | Sabit | Dinlemede komut bekliyor |
| Silme işlemi boyunca | Mavi | Sabit | Hafızadan önceki ölçüm siliniyor |
| Ölçüm bitiminden başlangıcına kadar | Beyaz | Yanıp-Sönme | Ölçüm alıyor |
| Ölçüm verileri gönderilene kadar | Mor | Yanıp-Sönme | Ölçüm verilerini gönderiyor |
| 1 dakika | Açık Mavi | Sabit | Güncelleme modunda mesaj bekleniyor |
| Güncelleme mesajı boyunca | Sarı | Yanıp-Sönme | Güncelleme modunda mesaj alındı |
| 3 defa | Yeşil | Kısa | Güncelleme mesajı başarıyla alındı |
| 1 defa | Kırmızı | Uzun | Güncelleme mesajı sırasında hata oluştu |
| 3 defa | Kırmızı | Uzun | Güncelleme modunda 1 dakika bekleme sonunda mesaj alınmadı |
| 1 saniye | Mor | Sabit | Güncelleme başladı |
| Yeni güncelleme cihaza yazılana kadar | Mor | Yanıp-Sönme | Güncelleme verisi cihaza yazılıyor |
| 3 defa | Yeşil | Kısa | Güncelleme başarıyla tamamlandı |
| Tekrar sayısı hata kodunu verir. | Kırmızı | Uzun | Güncelleme sırasında problem oluştu |
| 5 defa | Kırmızı | Uzun | Son 5 güncelleme denemesi hatalı |

## 2. Wired haberleşme protokolü

Wired cihazlarda kullanılan haberleşme protokolü aşağıdaki gibidir. Veri alma ve gönderme protokolü UART - RS485 protokolü üzerine çalışmaktadır. Cihazın bu versiyonunda UART baud rate 1000000 olarak sabitlenmiştir. Veri protokolünde başlangıç sayısı ve bitiş sayısı sabit tutulmalıdır. 2-bit olarak ayrılan mesaj tipi de _0b00_ şeklinde sabit kalmalıdır. Gönderilen bütün mesajlar aşağıda gösterildiği şekilde paketlenmiş halde olmalıdır. Alınan mesajların çözülmesi de yine aynı şekilde yapılmalıdır.

![Figür 1 : Haberleşme protokolü](/images/wired-protocol.jpg)

Veri boyutu alanı bir bayt ile temsil edilir, bu sebepten veri boyutu maksimum 255 olabilir olabilir.

Adres alanı 4-bit alıcı, 4-bit verici olmak üzere toplamda 1 bayt olmalıdır. Wired cihazlar bir ağ içinde birden fazla bulunabilecekleri için adres alanından istenilen cihazın adresi belirtilerek sadece o cihaza komut gönderilebilir. Gönderilen mesaj paketinde alıcı adresi 15(0x0F) şeklindeyse ağda bulunan bütün cihazlar bu mesajı alabilir. Cihazın tuttuğu adres sonradan atanan bir sayı değeridir, isteğe göre değiştirilebilir. Cihaz her başladığında 14(0x0E) adresini dinlemeye başlar.

Gönderici adresi olarak istenilen değer girilebilir, ancak Wired cihazlar her zaman 13(0x0D) adresini alıcı olarak belirleyip mesaj gönderirler. Bu yüzden 13 adresinin gönderici adresi olarak kullanılması uygundur.

Mesaj indeksi önceden belirlenen mesaj tiplerine göre ayrılmıştır. Sadece 0x0A - 0x13 (11 - 19) aralığındaki mesaj indeksleri kullanıcıya ayrılmıştır. Kalan değerler başka işlemler için tutulmuştur ve kullanılmamalıdır.

Taşınan veri paketin başlangıç serisi ile bitiş serisi arasına sıkıştırılarak gönderilmelidir. Paket başlıklarının veri boyutları önceden belirli olduğu için veri boyunun belirlenmesi paket bitiminin kontrolü için önem taşır.

CRC hesabı başlangıç sayısından başlayarak verinin son baytına kadar yapılır. Sadece iki bayt CRC verisi ile paket sonundaki 0xBF bitiş sayısı CRC hesabına dâhil edilmez. CRC için kullanılan algoritma [Hata tespiti (CRC) kontrolü](#_eva3w140pn4z) bölümünde anlatılmıştır.

## 3. Mesaj (Komut) tipleri

Mesaj tipleri Wired cihazların daha önceden belirlenen işlemleri yapmalarını sağlar. Daha önce açıklanan protokolün başlangıç serisinde yer alan _mesaj indeksi_ komut isimlerinin yanında yer almaktadır. Cihaz ile sorunsuz bir haberleşme için mesajlar uygun formatta gönderilmeli, cevaplar ise belirtilen formatta işlenmelidir.

Bazı mesaj içeriklerinde mesaj durumu değişkeni bulunmaktadır. Bu değişken aşağıda verilen tablodaki değerleri alır ve Wired tarafından gelen cevapların durumunu anlamak için kullanılır.

Tablo 2 : Mesajlarda bulunan durum değişkeni

| **Mesaj durumu** | **Mesaj kodu** |
| --- | --- |
| Hata | 0x00 |
| Başarılı | 0x01 |
| Zaman aşımı | 0x02 |
| Veri | 0x03 |
| Yanlış mesaj tipi | 0x04 |
| Bozulmuş paket | 0x05 |

### 3.0 Cihaz versiyonu okuma (0x0A)

Cihazın hangi sürümde olduğunu okumak için 0x0A mesaj indeksine boş mesaj gönderilir.

Tablo 3 : Versiyon okuma gönderilen mesaj formatı

| **Boş mesaj** |
| --- |
| 0 bayt |

Buna cevap olarak cihazdan beklenen mesaj şu formattadır:

Tablo 4 : Versiyon okuma alınan mesaj formatı

| **Major** | **Minor** | **Patch** |
| --- | --- | --- |
| 1 bayt | 1 bayt | 1 bayt |

### 3.1 Cihaz MAC adresini okuma (0x0B)

Cihaza 0x0B mesaj indeksi ile 5 adet sıfır veri olarak gönderildiğinde cihaz cevap olarak üzerinde bulunan 6 baytlık MAC adresini gönderir. Sıfır haricinde başka veri gönderilmesi cihazın konfigürasyonunu değiştirip mesajın geç gelmesine sebep olabilir. Bu alan daha sonra kullanılmak için ayrılmıştır.

Tablo 5 : MAC adres okuma gönderilen mesaj formatı

| **Cihaz konfigürasyonu için ayrılmış veriler** |
| --- |
| 5 bayt - (00000) |

Tablo 6 : MAC adres okuma alınan mesaj formatı

| **MAC adresi** |
| --- |
| 6 bayt |


### 3.2 Cihaza haberleşme için adres atama (0x0C)

Wired cihazlar çalışmaya başladıklarında 14 adresine kayıt olup bu adresi dinlemeye başlarlar. Eğer bir Wired cihaz ile çalışılacaksa alıcı adresi olarak mesajlarda 14 kullanılabilir, ancak birden fazla Wired aynı hatta yer alacaksa adres atanması gerekir.

Bunun için mesaj içeriğinde Wired MAC adresi ve atanan adres olmalıdır. Bir hatta izin verilen maksimum Wired sayısı 11 ile sınırlandırılmıştır. Bu yüzden atanabilecek adresler 0-11 aralığında olmalıdır.

Tablo 7 : Adres atama gönderilen mesaj formatı

| **Atanan adres** | **MAC adresi** |
| --- | --- |
| 1 bayt | 6 bayt |

Bu mesaja herhangi bir cevap dönülmez, bir sonraki mesaj için cihaz artık verilen adresi dinlemeye başlar. MAC adresinin hatalı olması durumunda adres atanması yapılamaz. Cihaz önceki adresinden haberleşmeye devam eder.

Tablo 8 : Adres atama beklenilen mesaj formatı

| Mesaj dönülmez |
| --- |
| - |

### 3.3 Ölçüm başlatma (0x0D)

Cihazın ölçüme başlaması için mesaj indeksi 0x0D yapılır. Gönderilen mesaj formatı şu şekilde olmalıdır.

Tablo 9 : Ölçüm başlatma gönderilen mesaj formatı

| İvmeölçer indeksi | Frekans indeksi | Örnekleme boyutu | Ölçüm bitimini bildirme |
| --- | --- | --- | --- |
| 1 bayt | 1 bayt | 4 bayt (Little Endian) | 1 bayt |

- İvmeölçer aralığı : İvmeölçer ölçeklendirmesi için atanan ivme aralığı, Tablo 10 üzerinde ivmeölçer indeksi ve aralıklar olarak belirtilmiştir.
- Frekans indeksi : Örnekleme frekansı için atanan frekans indeksi Tablo 11 üzerinde indeksler ve değerler olarak belirtilmiştir.
- Örnekleme boyutu : cihazın bir anda tutabileceği maksimum örnek boyutu 1,369,429 örnek şeklindedir.
- Ölçüm bitimini bildirme : Eğer 1 gönderilirse cihaz ölçüm bitimine yine aynı mesaj indeksi ile dönüş yapar. Bu cevapta ölçümün başarılı bitip bitmediği yer alır. Eğer 0 gönderilirse ölçüm alınır ve cihaz normal çalışmasına devam eder, ölçüm sonucunun ne zaman alınacağı kullanıcı tarafından hesaplanmalıdır.

Tablo 10 : İvmeölçer indeksi ve karşılık düşen aralık

| İvmeölçer indeksi | İvme ölçer aralığı |
| --- | --- |
| 0x01 | ±2 g |
| 0x02 | ±4 g |
| 0x03 | ±8 g |
| 0x04 | ±16 g |

Tablo 11 : Frekans indeksi ve karşılık düşen frekans değeri

| Frekans indeksi | Frekans Değeri |
| --- | --- |
| 0x05 | 800 Hz |
| 0x06 | 1600 Hz |
| 0x07 | 3200 Hz |
| 0x08 | 6400 Hz |
| 0x09 | 12800 Hz |

Ölçüm bitiminde cevap istenmiş ise cihaz daha önce belirtilen durum kodlarını gönderir. Bu veri uzunluğu boyutu bir bayttır.

Tablo 12 : Ölçüm başlatma beklenilen mesaj format (Ölçüm bildirme 1 durumunda)

| Ölçüm durumu |
| --- |
| 1 bayt |

Örnek olarak aşağıdaki konfigürasyonlarla bir ölçüm başlatmak için gönderilmesi gereken mesaj verisi şu şekilde olmalıdır :

Tablo 13 : Örnek ölçüm konfigürasyonu

| İvmeölçer indeksi | Frekans indeksi | Örnekleme boyutu | Ölçüm bitimini bildirme |
| --- | --- | --- | --- |
| 3 | 6 | 10000 | 1 |

Örnekleme boyutu mesaj içerisinde _Little Endian_ şeklinde betimlenmelidir. Yani düşük önemli bitler verinin ilk kısmında olmalı, en önemli bit ise verinin son kısmında yer almalıdır. Tablo 14&#39;te 10000 sayısının 4-bayt dizi şeklinde gösterimi yer almaktadır. İstenilen örnekleme boyutu örnekteki gibi bayt dizisine çevrilmelidir.

Tablo 14 : Örnek ölçüm konfigürasyonu için hazırlanan veri formatı (onaltılık tabanda)

| İvmeölçer indeksi [7:0] | Frekans indeksi[7:0] | Örnekleme boyutu[7:0] | Ölçüm bitimini bildirme[7:0] |
| --- | --- | --- | --- |
| 0x03 | 0x06 |<table>  <thead>  <tr>  <th>[7:0]</th> <th> [15:8]</th><th>[23:16]</th><th>[31:24]</th></tr></thread><tbody><td>0x10</td><td>0x27</td><td>0x0</td><td>0x0</td></tbody></table> | 0x01 |

Haberleşme protokolü ile birlikte yukarıda hazırlanan mesaj toplamda 14 bayt ile gösterilir şu şekli almalıdır :

Tablo 15 : Örnek ölçüm konfigürasyonunda hazırlanması gereken mesaj paketi (onluk tabanda)

| 251 | 7 | 222 | 52 | 3 | 6 | 16 | 39 | 0 | 0 | 1 | 137 | 231 | 191 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

### 3.4 Ölçüm okuma (0x0E)

Cihaz meşgul durumda değilse hafızada yer alan son ölçüm istenilen her zaman okunabilir. Ölçüm okuma komutuna boş mesaj gönderilir.

Tablo 16 : Ölçüm okuma gönderilen mesaj formatı

| Boş mesaj |
| --- |
| 0 bayt |

Wired tarafından bu mesaja cevap olarak farklı formatlarda mesajlar gönderilir. Ancak bütün mesajlar 0x0E mesaj indeksi ile döner.

Tablo 17 : Ölçüm okuma başarılı durumda beklenilen mesaj formatı

| Mesaj durumu | Ölçüm boyutu | Ölçüm verisi |
| --- | --- | --- |
| 1 bayt (0x03) | 1 bayt | 6 bayt - 240 bayt (_Little Endian_ - işaretli) |

Ölçüm verisinin formatı minimum 6 bayt, maksimum 240 bayt olabilir. Bir örnek 6 bayt veriden oluşur. 16-bit tamsayı formatında önce X-ekseni, sonra Y-ekseni ve son olarak Z-ekseni gönderilir (15.bit işaret bitini temsil eder). 16-bit tamsayı, 8-bit olarak iki adet _Little Endian_ formatında yazılır. Böylelikle cihazdan minimum 1 örnek, maksimum 40 örnek bir mesaj paketinde okunabilir.

Tablo 18 : Bir ölçüm verisinin bayt dizisi şeklinde gösterimi

| X1 | Y1 | Z1 |
| --- | --- | --- |
| X[7:0] | X[15:8] | Y[7:0] | Y[15:8] | Z[7:0] | Z[15:8] |
| 2bayt | 2bayt | 2bayt |

Her örnek yukarıdaki şekilde _Little Endian_ olarak temsil edilir.

240 baytlık bir ölçüm verisi şu şekilde örneklere ayrılır :

3 (eksen) \* 2 (16 bitlik tamsayı) \* 40 örnek = 240 bayt

Tablo 19 : Ölçüm paketinin ivmeölçer eksen verisi üzerinden gösterimi

| X1 | Y1 | Z1 | X2 | Y2 | Z2 | ... | X40 | Y40 | Z40 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2byte | 2byte | 2byte | 2byte | 2byte | 2byte | ... | 2byte | 2byte | 2byte |

Alıcı taraf ölçüm boyutunu bilmiyorsa gelen mesajlarda ölçüm boyutuna bakarak (bayt formatında) cihazdaki son ölçümün örnekleme boyutunu alınan paketlerin toplam boyutunu 6&#39;ya bölerek bulabilir. Ölçüm verileri gönderilirken mesaj durumu Tablo-1&#39;de gösterilen Veri durumu ile gösterilir ve değeri 0x03 olur.

Son ölçüm paketi gönderildikten sonra Wired yine aynı mesaj indeksine mesaj durumunu değiştirerek kalibrasyon frekansını ve cihazın ölçüm aldığı sıcaklığı gönderir. Mesaj formatı şu şekildedir :

Tablo 20 : Ölçüm okuma başarılı bitmişse beklenilen mesaj formatı

| Mesaj durumu | Kalibrasyon frekansı | Sıcaklık |
| --- | --- | --- |
| 1 bayt (0x01) | 4 bayt (_Little Endian_ - işaretsiz) | 2 bayt (_Little Endian -_ işaretli) |

Eğer ölçüm okuma sırasında herhangi bir hata çıkmışsa ;

Tablo 21 : Ölçüm okuma sırasında bir hata oluşmuşsa

| Mesaj durumu | Hata kodu |
| --- | --- |
| 1 bayt (0x00) | 1 bayt |

Tablo 22 : Ölçüm okuması sırasında oluşabilecek hatalar ve kodları

| Hata durumu | Hata kodu |
| --- | --- |
| Ölçüm yok | 0x00 |
| Ölçüm paketleri bozuk | 0x01 |
| Zaman aşımı | 0x02 |

### 3.5 Clearance okuma (0x0F)

Sadece mesaj indeksi 0x0F olmalı ve gönderilen veri boyutu sıfır olmalıdır.

Tablo 23 : Clearance gönderilen mesaj formatı

| Boş mesaj |
| --- |
| 0 bayt |

Tablo 24 : Clearance okuma beklenilen mesaj formatı

| Clearance-X | Clearance-Y | Clearance-Z |
| --- | --- | --- |
| 8 bayt (IEEE-754 double) | 8 bayt (IEEE-754 double) | 8 bayt (IEEE-754 double) |

### 3.6 Crest okuma (0x10)

Sadece mesaj indeksi 0x10 olmalı ve gönderilen veri boyutu sıfır olmalıdır.

Tablo 25 : Crest okuma gönderilen mesaj formatı

| Boş mesaj |
| --- |
| 0 bayt |

Tablo 26 : Crest okuma beklenilen mesaj formatı

| Crest-X | Crest-Y | Crest-Z |
| --- | --- | --- |
| 8 bayt (IEEE-754 double) | 8 bayt (IEEE-754 double) | 8 bayt (IEEE-754 double) |

### 3.7 GRMS okuma (0x11)

Sadece mesaj indeksi 0x11 olmalı ve gönderilen veri boyutu sıfır olmalıdır.

Tablo 27 : GRMS okuma gönderilen mesaj formatı

| Boş mesaj |
| --- |
| 0 bayt |

Tablo 28 : GRMS okuma beklenilen mesaj formatı

| GRMS-X | GRMS-Y | GRMS-Z |
| --- | --- | --- |
| 8 bayt (IEEE-754 double) | 8 bayt (IEEE-754 double) | 8 bayt (IEEE-754 double) |

###

### 3.8 Kurtosis okuma (0x12)

Sadece mesaj indeksi 0x12 olmalı ve gönderilen veri boyutu sıfır olmalıdır.

Tablo 29 : Kurtosis okuma gönderilen mesaj formatı

| Boş mesaj |
| --- |
| 0 bayt |

Tablo 30 : Kurtosis okuma beklenilen mesaj formatı

| Kurtosis-X | Kurtosis-Y | Kurtosis-Z |
| --- | --- | --- |
| 8 bayt (IEEE-754 double) | 8 bayt (IEEE-754 double) | 8 bayt (IEEE-754 double) |

### 3.9 Skewness okuma (0x13)

Sadece mesaj indeksi 0x13 olmalı ve gönderilen veri boyutu sıfır olmalıdır.

Tablo 31 : Skewness okuma gönderilen mesaj formatı

| Boş mesaj |
| --- |
| 0 bayt |

Tablo 32 : Skewness okuma beklenilen mesaj formatı

| Skewness-X | Skewness-Y | Skewness-Z |
| --- | --- | --- |
| 8 bayt (IEEE-754 double) | 8 bayt (IEEE-754 double) | 8 bayt (IEEE-754 double) |

## 4. Hata tespiti (CRC) kontrolü

Haberleşme protokolünde kullanılan CRC hesabı için CRC-16 algoritması tercih edilmiştir. Aşağıda bir bayt veri için hesaplanan CRC örnek kodu yer almaktadır.

CRC polinomu x^16 + x^15 + x^2 + 1, POLY\_IBM ile gösterilmiştir. CRC değişkeni ilk olarak CRC\_IBM\_SEED (0xFFFF) ile başlamalı ve hesaplanan her crc değeri bir sonraki bayt için gösterilen fonksiyona parametre olarak verilmelidir.

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

Figür 2 : 1 bayt veri için örnek CRC kodu


## 5. Kablo bağlantıları

Kablo bağlantıları ve renk kodları

| Renk | Kablo ismi |
| --- | --- |
| Kalın siyah (makaronlu) | GND (Shield) |
| İnce siyah | VCC (5-36V) |
| Beyaz | A |
| Kırmızı | B |

