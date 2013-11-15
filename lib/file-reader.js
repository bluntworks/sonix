var Tru = require('through')

function read(fd, cb) {
  var reader = new FileReader()

  reader.onload = function(e) {
    cb(null, {
      fd: fd,
      abuf: e.target.result,
      read: reader
    })
  }

  reader.readAsArrayBuffer(fd)
}

var fr = module.exports = function() {

  var tru = Tru(function(fd) {
    var self = this
    read(fd, function(err, _fd) {
      self.queue(_fd)
    })
  })

  tru.autoDestroy = false

  return tru
}
