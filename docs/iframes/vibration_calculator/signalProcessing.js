
define(function () {
  return function buildSignalProcessing({ tf }) {
    return Object.freeze({
      Grms,
      Grms_score,
      Grms_range_score,
      Vrms,
      Vrms_score,
      Vrms_range_score,
      generateWindow,
      getCorrectionCoefficient,
      Kurtosis,
      highpass,
      lowpass,
      bandpass,
      Crest,
      Crest_star,
      Skewness,
      Clearance,
      Roll,
      Pitch

    })

    function freqToindex(freq, sampleSize, samplingRate) {
      return Math.ceil(sampleSize * freq / samplingRate)
    }

    function Clearance(data) {
      if (!data.length) return 0;
      let t_signal = tf.tensor1d(data, "float32");

      let clearance = t_signal.abs().max().div(t_signal.abs().sqrt(2).sum().div(t_signal.size).pow(2));
      return clearance.dataSync()[0]
    }
    //yaw = 180 * atan (accelerationZ/sqrt(accelerationX*accelerationX + accelerationZ*accelerationZ))/M_PI;


    function Roll(y_data, z_data) {
      if (!y_data.length) return 0;
      let y_data_mean = tf.tensor1d(y_data, "float32").mean();
      let z_data_mean = tf.tensor1d(z_data, "float32").mean();
      let roll = tf.atan2(y_data_mean, z_data_mean).mul(57.3)

      return roll.dataSync()
    }

    function Pitch(x_data, y_data, z_data) {
      if (!x_data.length) return 0;
      let x_data_mean = tf.tensor1d(x_data, "float32").mul(-1).mean();
      let y_data_mean = tf.tensor1d(y_data, "float32").mean();
      let z_data_mean = tf.tensor1d(z_data, "float32").mean();
      let pitch = tf.atan2(x_data_mean, tf.add(y_data_mean.square(), z_data_mean.square()).sqrt()).mul(57.3)
      return pitch.dataSync()
    }

    function Crest(data) {
      if (!data.length) return 0;
      let t_signal = tf.tensor1d(data, "float32");
      const data_mean = t_signal.mean();
      var normalized = t_signal.sub(data_mean)
      let peek = normalized.abs().max().dataSync()[0];
      let grms = Grms_score(normalized.arraySync())
      return peek / grms;
    }
    function Skewness(data) {
      if (!data.length) return 0;
      let t_signal = tf.tensor1d(data, "float32");
      let tAvg = t_signal.mean();
      let res = t_signal.sub(tAvg).pow(3).sum().div(t_signal.size).div(t_signal.sub(tAvg).pow(2).sum().div(t_signal.size).pow(1.5))
      return res.dataSync()[0]
    }
    function Kurtosis(data) {
      if (!data.length) return 0;
      let t_signal = tf.tensor1d(data, "float32");
      let tAvg = t_signal.mean();
      let res = t_signal.sub(tAvg).pow(4).sum().div(t_signal.size).div(t_signal.sub(tAvg).pow(2).sum().div(t_signal.size).pow(2))
      return res.dataSync()[0]
    }
    function Grms_score(data) {
      if (!data.length) return 0;
      let t_signal = tf.tensor1d(data, "float32");
      let t_mean = t_signal.mean()
      let grms = t_signal.sub(t_mean).pow(2).div(data.length).sum().sqrt().dataSync()[0]

      return grms;
    }
    function bandpass(signal, samplingRate, threshold_lower, threshold_upper) {
      threshold_lower = threshold_lower || 1000
      threshold_upper = threshold_upper || 2000
      if (threshold_lower > threshold_upper) {
        console.log("threshold_upper  should be greater than threshold_lower, actual:", samplingRate)
        return null;
      }
      if (samplingRate < (threshold_upper * 2)) {
        console.log("sampling rate should be greater than threshold_upper * 2 + 1, actual:", samplingRate)
        return null
      }
      let t_signal = tf.tensor1d(signal, "float32")
      var t_fft = t_signal.rfft() //FFT aldım complex' tensör

      // 1000Hz'nin başlangıç indexini buluyorum
      let frequency_index_lower = freqToindex(threshold_lower, signal.length, samplingRate)
      let frequency_index_upper = freqToindex(threshold_upper, signal.length, samplingRate)
      let t_zeros_lower = tf.zeros([frequency_index_lower]) //nyquist olduğu için baştan ve sondan bu kadar kırpacağım
      let t_zeros_upper = tf.zeros([t_fft.shape - frequency_index_upper]) //nyquist olduğu için baştan ve sondan bu kadar kırpacağım
      let t_ones = tf.ones([frequency_index_upper - frequency_index_lower]) // baştan ve sondan kırptığım kısım harici kadar duracak
      let t_filter = tf.concat([t_zeros_lower, t_ones, t_zeros_upper])///11110000011111
      let t_filtered = t_fft.mul(t_filter) //maskeyi uyguluyorum
      //tensorflow fft 
      console.log(JSON.stringify(t_filtered.abs().arraySync()));

      let t_filtered_signal = tf.irfft(t_filtered);
      return t_filtered_signal.arraySync()[0];
    }

    function lowpass(signal, samplingRate, threshold) {
      threshold = threshold || 1000
      if (samplingRate < threshold * 2 + 1) {
        console.log("sampling rate should be greater than 3000Hz, actual:", samplingRate)
        return null
      }
      let t_signal = tf.tensor1d(signal, "float32")
      var t_fft = t_signal.rfft() //FFT aldım complex' tensör

      // 1000Hz'nin başlangıç indexini buluyorum
      let frequency_index = freqToindex(threshold, signal.length, samplingRate)
      let t_ones = tf.ones([frequency_index]) //nyquist olduğu için baştan ve sondan bu kadar kırpacağım
      let t_zeros = tf.zeros([t_fft.shape - frequency_index]) // baştan ve sondan kırptığım kısım harici kadar duracak
      let t_filter = tf.concat([t_ones, t_zeros])///11111111000000000000
      let t_filtered = t_fft.mul(t_filter) //maskeyi uyguluyorum
      //tensorflow fft 
      let t_filtered_signal = tf.irfft(t_filtered);

      return t_filtered_signal.arraySync()[0];
    }

    function highpass(signal, samplingRate, threshold) {
      threshold = threshold || 1000
      if (samplingRate < 3000) {
        console.log("sampling rate should be greater than 3000Hz, actual:", samplingRate)
        return null
      }
      let t_signal = tf.tensor1d(signal, "float32")
      var t_fft = t_signal.rfft() //FFT aldım complex' tensör
      // 1000Hz'nin başlangıç indexini buluyorum
      let frequency_index = freqToindex(threshold, signal.length, samplingRate)
      let t_zeros = tf.zeros([frequency_index]) //nyquist olduğu için baştan ve sondan bu kadar kırpacağım
      let t_ones = tf.ones([t_fft.shape - frequency_index]) // baştan ve sondan kırptığım kısım harici kadar duracak
      let t_filter = tf.concat([t_zeros, t_ones])///0000011111
      let t_filtered = t_fft.mul(t_filter) //maskeyi uyguluyorum
      //tensorflow fft 
      let t_filtered_signal = tf.irfft(t_filtered);
      return t_filtered_signal.arraySync()[0];
    }
    function Crest_star(data, samplingRate) {
      if (!samplingRate) return null;
      if (!data.length) return null;
      let filtered_signal = highpass(data, samplingRate)
      let t_filtered_signal = tf.tensor1d(filtered_signal, "float32");
      let filtered_peek = t_filtered_signal.max().dataSync()[0];
      let filtered_grms = Grms_score(filtered_signal)
      return filtered_peek + filtered_grms + (filtered_peek / filtered_grms);
    }
    function Vrms_range_score(data, lowerFrequency, upperFrequency, samplingRate) {
      let maxUpperFreq = (samplingRate / 2);
      if (upperFrequency > maxUpperFreq) {
        upperFrequency = maxUpperFreq;
        console.log("upper frequency has been changed to maxUpperFrequency")
      }
      if (!samplingRate) return null;
      if (!data.length) return 0;
      let filtered = bandpass(data, samplingRate, lowerFrequency, upperFrequency)
      return Vrms_score(filtered, samplingRate)
    }
    function Window(data, window) {
      let t_signal = tf.tensor1d(data, "float32");
      var windowArray = generateWindow(
        window,
        data.length
      );
      var correctionCoefficient = getCorrectionCoefficient(
        window,
        "amplitude"
      );
      var tWindow = tf.tensor1d(windowArray, "float32");
      var tCorrectionCoefficient = tf.scalar(correctionCoefficient);
      t_signal = t_signal.mul(tWindow);
      t_signal = t_signal.mul(tCorrectionCoefficient);
      return t_signal.arraySync()
    }
    function Grms_range_score(data, lowerFrequency, upperFrequency, samplingRate) {
      let maxUpperFreq = (samplingRate / 2);
      if (upperFrequency > maxUpperFreq) {
        upperFrequency = maxUpperFreq;
        console.log("upper frequency has been changed to maxUpperFrequency")
      }
      if (!samplingRate) return null;
      if (!data.length) return 0;
      let filtered = bandpass(data, samplingRate, lowerFrequency, upperFrequency)
      return Grms_score(filtered)
    }
    function Vrms_score(data, frequency) {

      if (!data.length) return 0;
      var fft = Vrms(data, frequency)
      fft = fft.slice(1, parseInt(fft.length / 2 + 1));
      let t_rms = tf.tensor1d(fft, "float32");
      let vrms_score = Math.sqrt(t_rms.pow(2).sum().dataSync())

      return vrms_score;
    }
    function Vrms(data, frequency, window) {
      let t_signal = tf.tensor1d(data, "float32");
      t_signal = tf.mul(t_signal, tf.scalar(9806.65))

      if (window) {
        var windowArray = generateWindow(
          window,
          data.length
        );
        var correctionCoefficient = getCorrectionCoefficient(
          window,
          "amplitude"
        );

        var tWindow = tf.tensor1d(windowArray, "float32");
        var tCorrectionCoefficient = tf.scalar(correctionCoefficient);
        t_signal = t_signal.mul(tWindow);
        t_signal = t_signal.mul(tCorrectionCoefficient);
      }

      let t_imag = tf.zeros(t_signal.shape)
      let t_complex = tf.complex(t_signal, t_imag)

      var fft = t_complex.fft()
      var t_mag = tf.abs(fft)
      let t_omega = tf.linspace(0, 2 * Math.PI * frequency, data.length)
      let t_vrms = tf.div(t_mag, t_omega)

      var multiplier = tf.scalar(Math.sqrt(2) / data.length);
      t_vrms = tf.mul(t_vrms, multiplier);
      let vrms = t_vrms.arraySync()
      let Hz3_index = freqToindex(3, vrms.length, frequency)
      for (var i = 0; i <= Hz3_index; i++) {
        vrms[i] = 0;
      }
      return vrms;
    }
    function Grms(data) {
      let t_signal = tf.tensor1d(data, "float32");
      let t_fft = tf.rfft(t_signal)
      var t_mag = tf.abs(t_fft)
      var multiplier = tf.scalar(Math.sqrt(2) / data.length);
      let fft = tf.mul(t_mag, multiplier);
      return fft.arraySync();
    }
    function getCorrectionCoefficient(windowType, correctionType) {
      let correctionCoefficient = 1
      switch (windowType) {
        case 'hanning': // Hanning window
          correctionCoefficient = correctionType === 'amplitude' ? 2.0 : 1.63
          break
        case 'hamming': // Hamming window
          correctionCoefficient = correctionType === 'amplitude' ? 1.85 : 1.59
          break
        case 'blackman': // Blackman window
          correctionCoefficient = correctionType === 'amplitude' ? 2.80 : 1.97
          break
        case 'flattop':
          correctionCoefficient = correctionType === 'amplitude' ? 4.18 : 2.26
          break
        default: // Rectangular window function
          correctionCoefficient = 1
      }
      return correctionCoefficient
    }
    function generateWindow(windowType, nSamples) {
      // generate nSamples window function values
      // for index values 0 .. nSamples - 1
      let m = nSamples / 2
      let r
      let pi = Math.PI
      let w = new Array(nSamples)
      switch (windowType) {
        case 'bartlett': // Bartlett (triangular) window
          for (let n = 0; n < nSamples; n++) {
            w[n] = 1.0 - Math.abs(n - m) / m
          }
          break
        case 'hanning': // Hanning window
          r = pi / (m + 1)
          for (let n = -m; n < m; n++) {
            w[m + n] = 0.5 + 0.5 * Math.cos(n * r)
          }
          break
        case 'hamming': // Hamming window
          r = pi / m
          for (let n = -m; n < m; n++) {
            w[m + n] = 0.54 + 0.46 * Math.cos(n * r)
          }
          break
        case 'blackman': // Blackman window
          r = pi / m
          for (let n = -m; n < m; n++) {
            w[m + n] = 0.42 + 0.5 * Math.cos(n * r) + 0.08 * Math.cos(2 * n * r)
          }
          break
        case 'flattop':
          for (let n = 0; n < nSamples; n++) {
            w[n] = 0.21557895 - 0.41663158 * Math.cos((2 * Math.PI * n) / nSamples) + 0.277263158 * Math.cos((4 * Math.PI * n) / nSamples) - 0.083578947 * Math.cos((6 * Math.PI * n) / nSamples)
          }
          break
        default: // Rectangular window function
          for (let n = 0; n < nSamples; n++) {
            w[n] = 1.0
          }
      }
      return w
    }
  }
});