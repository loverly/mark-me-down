var util = require('util');
var stream = require('stream');
var TransformStream = stream.Transform;

/**
 *
 */
function Parser() {

  // The Parser only deals in objects (at least this one does)
  TransformStream.call(this, {
    objectMode: true,
    readableObjectMode: true,
    writableObjectMode: true
  });
}

util.inherits(Parser, TransformStream);

/**
 * This is basically the PassThrough implementation of the duplex stream and
 * allows for future transformation if necessary.
 */
Parser.prototype._transform = function (data, encoding, callback) {
  if (data.token !== 'IGNORE') {
    this.push(data);
  }

  callback();
};

/**
 * No-op
 */
Parser.prototype._flush = function (callback) {
  callback();
};

module.exports = Parser;