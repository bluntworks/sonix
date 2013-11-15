var Tru = require('through')

var ctx = new ( window.AudioContext || window.webkitAudioContext )

var rate = ctx.sampleRate

var otx = new (window.offlineAudioContext
           ||  window.webkitOfflineAudioContext)(1, 2, rate)


function audio(fd, cb) {
  fd.ctx = ctx
  fd.otx = otx
  fd.rate = rate

  otx.decodeAudioData(
    fd.abuf,
    function ok(buffer) {
      fd.buffer = buffer
      fd.duration = buffer.duration
      cb(null, fd)
    },
    function err(err) {
      fd(err, fd)
    }
  )

}

module.exports = function() {

  var tru = Tru(function(fd) {
    var self = this
    audio(fd, function(err, _fd) {
      self.queue(_fd)
    })
  })

  tru.autoDestroy = false

  return tru
}
