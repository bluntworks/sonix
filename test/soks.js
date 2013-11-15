var log   = require('blunt-log')
var spawn = require('child_process').spawn
var tru   = require('through')
var chunk = require('chunk-stream')

var rate = 44000
var samples = rate / 8

var floats  = new Float32Array(samples)
var size    = floats.BYTES_PER_ELEMENT

log('size', size, floats.length)

blocks = chunk(floats.length)

var hold = []
var dbug = tru(function(d) { hold.push(d) } )

dbug.on('end', function() {
  log('end', size, hold.length)
})

process
    .stdin
    .pipe(blocks)
    .pipe(dbug)


