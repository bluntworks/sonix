var Tru     = require('through')
var ndarr   = require('ndarray')
var nfft    = require('ndarray-fft')
var mag     = require('ndarray-complex').mag
var Blocks  = require('chunk-stream')

var ops = {
  rate: 44000,
  samples: 44000 / 8,
  range: [ 0, 44000 ]
}

function fft(fd, cb) {
  var floats = new Float32Array(ops.samples)
  var size = floats.BYTES_PER_ELEMENT
  var block = new Blocks(floats.length * size)

  block.pipe(Tru(function(buf) {
    for(var  i = 0; i < floats.length; i++) {
      floats[i] = buf.readFloatLE(i * size)
    }
    log('tru', buf)
    block.emit('freqs', findFreqs(floats, opts))
  }))

  //log(floats[0], typeof floats[0])

  fd.fft = block

  log(fd)
  fd.fft.play = function() {
    for(var i = 0; i < floats.length; i++) {
      //block.write(fd.abuf[i])
    }
  }

  cb(null, fd)
}

function findFreqs(floats, ops) {
  var reals = ndarr(floats, [ floats.length, 1 ])
  var imags = ndarr.zero([ floats.length, 1 ])

  nfft(1, reals, imags)
  mag(reals, reals, imags)

  var freqs = []
  for(var i = 0; i < reals.data.length; i++) {
    var freq = i * opts.rate / floats.length
    if(freq >= ops.range[0] && freq <= ops.range[1]) {
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
