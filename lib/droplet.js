var EE = require('events').EventEmitter
var Tru = require('through')

var noop = function(e) {
  e.preventDefault()
  e.stopPropagation()
}

var Droplet = function(root) {
  if(!(this instanceof Droplet)) return new Droplet(root)
  EE.call(this)
  var self = this;

  root.on('drop', function(e) {
    e.preventDefault()
    e.stopPropagation()
    var files = e.originalEvent.dataTransfer.files
    self.process(files)
  })

  root.on('dragover', noop)
  root.on('dragenter', noop)
}

require('util').inherits(Droplet, EE)

Droplet.prototype.process = function(files) {
  for(var i = 0; i < files.length; i++) {
    this.emit('drop', files[i])
  }
}

module.exports = function(root) {
  var tru = Tru()

  var drop = new Droplet(root)
  drop.on('drop', function(fd) {
    tru.write(fd)
  })

  tru.autoDestroy = false
  return tru
}
