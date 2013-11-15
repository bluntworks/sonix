var Tru     = require('through')
var ndarr   = require('ndarray')
var zeros   = require('zeros')
var ndfft   = require('ndarray-fft')
var mag     = require('ndarray-complex').mag

function fft(fd, cb) {
  var bufr = fd.buffer
  var rate = bufr.sampleRate
  var range = [ 0, rate ]

  var c0 = bufr.getChannelData(0)
  var c1 = (bufr.numberOfChannels > 1)
              ? bufr.getChannelData(1) : false

  var size = c0.BYTES_PER_ELEMENT

  fd.fft = {
    freq0: findFreqs(c0, rate, range),
    freq1: (c1) ? findFreqs(c1, rate, range) : false
  }

  cb(null, fd)
}

function findFreqs(floats, rate, range) {
  var reals = ndarr(floats, [ floats.length, 1 ])
  var imags = zeros([ floats.length, 1 ])

  ndfft(1, reals, imags)
  mag(reals, reals, imags)

  var freqs = []
  for(var i = 0; i < reals.data.length; i++) {
    var freq = i * rate / floats.length
    if(freq >= range[0] && freq <= range[1]) {
      freqs.push([ freq, reals.data[i] ])
    }
  }

  return freqs
}

module.exports = function() {

  var tru = Tru(function(fd) {
    log('fd', fd)
    var self = this
    fft(fd, function(err, _fd) {
      self.queue(_fd)
    })
  })

  tru.autoDestroy = false

  return tru
}
