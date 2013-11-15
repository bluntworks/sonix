var o       = require('./lib/dom.js')
var droplet = require('./lib/droplet.js')
var reader  = require('./lib/file-reader.js')
var fft     = require('./lib/fft.js')
var audio   = require('./lib/audio-ctx.js')

var tru     = require('through')

var sonix = module.exports = function() {
  log('sonix')

  droplet(o('body'))
    .pipe(reader())
    .pipe(audio())
    .pipe(fft())
    .pipe(tru(function(fd) {
      fd.fft.on('freqs', function(freq) {
        log('freq', freq)
      })

      fd.fft.play()
    }))





}
