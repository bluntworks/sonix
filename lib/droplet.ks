var EE = require('events').EventEmitter

var noop = function(e) {
  e.preventDefault()
  e.stopPropagation()
}

var File = function(root) {
  if(!(this instanceof File)) return new File(root)
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

require('util').inherits(File, EE)

File.prototype.process = function(files) {
  for(var i = 0; i < files.length; i++) {
    this.emit('drop', files[i])
  }
}

module.exports = File
