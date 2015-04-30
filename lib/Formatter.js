var util = require('util');
var stream = require('stream');
var TransformStream = stream.Transform;

/**
 *
 */
function Formatter() {

  // The formatter only deals in objects (at least this one does)
  TransformStream.call(this, {
    objectMode: true,
    readableObjectMode: true,
    writableObjectMode: true
  });
}

util.inherits(Formatter, TransformStream);

/**
 * This is basically the PassThrough implementation of the duplex stream and
 * allows for future transformation if necessary.
 */
Formatter.prototype._transform = function (data, encoding, callback) {
  this.push(data);
  callback();
};

/**
 * No-op
 */
Formatter.prototype._flush = function (callback) {
  callback();
};


module.exports = Formatter;