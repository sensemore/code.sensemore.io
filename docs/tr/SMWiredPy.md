# SMWiredPy
[Sensemore](https://sensemore.io) - Wired titreşim sensörü için Python arayüzü

![Wired](https://github.com/sensemore/SMWiredPy/blob/master/img/wired.jpg?raw=true)


<a href="https://github.com/sensemore/SMWiredPy"><img width="50" style="line-height:10px" src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"></img></a>

## Kütüphaneyi yüklemek

- pip kullanarak
```bash
	$ pip install SMWired
```
- Kaynaktan derleme

```bash
	#Inside the library folder
	$ pip install .
```
## Gereksinimler
- pybind11
- pyserial
- SMComPy (pip install SMComPy)

## Örnek kullanım

``` python

from sensemore import SMWiredPy

wired_network = SMWiredPy.SMWired(port = "/dev/ttyUSB0", configure_network='auto', max_device_number=2)
#Bulunan kullanılabilir cihazları listeler
print("Erşilebilir cihazlar:",wired_network.get_available_devices())

devices = wired_network.get_available_devices()

#Cihaz versiyonunlarını listeler
for device in devices:
	print(" '%s' vesiyonu %s"%(device,wired_network.get_version(device)))


#Belirli bir cihazdan ölçüm alır

mac = 'CA:B8:31:00:00:55'
accelerometer_range = "16G"
sampling_frequency = 12800
sample_size = 100

measurement_result = wired_network.measure(mac,accelerometer_range,sampling_frequency,sample_size)

result_acc_x = measurement_result[0]
result_acc_y = measurement_result[1]
result_acc_z = measurement_result[2]

"""
get_all_telemetry metodunu çağırarak, wired cihazının içinde hesaplatığı telemetrik değerleri de  alabiliriz
"""

telemetries = wired_network.get_all_telemetry(mac)
print(telemetries)


```

## Geçerli ivmeölçer örnekleme frekansları

```
- 800 Hz
- 1600 Hz
- 3200 Hz
- 6400 Hz
- 12800 Hz
```

## Geçerli ivmeölçer aralıkları

```
- 2G
- 4G
- 8G
- 16G
```


## Komut satırı arayüzü


- Wired cihazını cli ile güncelleme
```bash
python -m sensemore.SMWiredPy update --port=/dev/ttyUSB0 --mac=CA:B8:31:00:00:3C --file=Wiredv1_0_13.bin 
```
- Hızlı ölçüm alma
```
python -m sensemore.SMWiredPy measure --port=/dev/ttyUSB0 --mac=CA:B8:31:00:00:3C --sample=1000 --freq=12800 -acc=16G -t
```

