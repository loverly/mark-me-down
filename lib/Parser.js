var util = require('util');
var stream = require('stream');
var TransformStream = stream.Transform;

/**
 * Handles identification of fenced code blocks
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
Parser.prototype._transform = function transform(data, encoding, callback) {
  var block;
  if (data.token !== 'IGNORE') {
    block = this._identifyFencedBlocks(data);
    this.push(block);
  }

  callback();
};

/**
 * No-op
 */
Parser.prototype._flush = function flush(callback) {
  callback();
};

/**
 *
 */
Parser.prototype._identifyFencedBlocks = function identifyFencedBlocks(data) {
  var text;
  var codeBlockRegex = /```[^`]+```/;
  var htmlRegex = /%%%[^%]+%%%/;
  var attrVal = data.attributeValue;


  if (data.token !== 'paragraph') {
    return data;
  }

  if (attrVal.length !== 1 || attrVal[0].attributeValue.type !== 'text') {
    return data;
  }

  text = attrVal[0].attributeValue.text;

  if (codeBlockRegex.test(text)) {
    data.token = 'code-block';
    attrVal[0].attributeValue.text = text.replace(/```/g, '');
  }

  if (htmlRegex.test(text)) {
    data.token = 'html';
    attrVal[0].attributeValue.text = text.replace(/%%%/g, '').trim();
  }

  return data;
};

module.exports = Parser;