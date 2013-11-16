var o   = require('../lib/dom.js')
var Err = require('../lib/error.js')
var tru = require('through')
var domify = require('domify')

function clamp(x) {
  return Math.floor(Math.min(255, Math.max(0, x)))
}

function getCanvas() {
  var c = domify('<canvas/>')
  var ctx = c.getContext('2d')

  return {
    canvas: c,
    ctx: ctx
  }
}


function getDy(ch, r) {
  var r0 = r[0]
  var r1 = r[1]
  return ch / Math.log(ch +1)
            * Math.log(2)
            * 44100 / (r1 - r0)
}

function build(el, fd, cb) {
  var c = getCanvas()

  c.el = el

  window.onresize = function() {
    c.canv.width = el.width()
    c.canv.height = el.height()
  }

  c.scope = function() {
    var freq  = fd.fft.freq0
    var range = fd.fft.range
    var canv  = c.canvas
    var ch    = canv.height
    var dy    = getDy(ch, range)

    function yOf(n) {
      return Math.floor(dy * Math.log(n + 1) / Math.log(2))
    }

    var rgba = []

    freq.forEach(function(f, i) {
      var x  = clamp(f[1])
      var y  = Math.floor(dy * Math.log(i + 1) / Math.log(2)) - yOf(range[0])
      var _y = Math.floor(dy * Math.log(i + 2) / Math.log(2)) - yOf(range[0])
      if(y < 0 || y > ch) return

      for(var j = y * 4; j < _y * 4; j += 4) {
        rgba[j] = rgba[j + 1] = rgba[j +2] = x
        rgba[j + 3] = 255
      }
    })

    log('rgba', rgba)
  }

  fd.canv = c

  cb(null, fd)
}

module.exports = function(el) {
  return tru(function(fd) {
    var self = this
    build(el, fd, function(err, fd) {
      if(err) Err(err, fd)
      else self.queue(fd)
    })
  })
}
