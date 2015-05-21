var util = require('util');
var stream = require('stream');
var TransformStream = stream.Transform;

/**
 * This is an object formatter that transforms objects from the raw lexer output
 * into something more useable by the application.
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
 *
 */
Formatter.prototype._transform = function (data, encoding, callback) {
  this.push(this._reformat(data));
  callback();
};

/**
 * No-op
 */
Formatter.prototype._flush = function (callback) {
  callback();
};

/**
 * Change the shape and structure of the markdown object based on its block type
 */
Formatter.prototype._reformat = function (token) {
  return this._typeFormatters[token.token](token);
};

/**
 * Provide block-level object reformatting to transform from a generic token
 * structure to a simplified markup-friendly DSL.
 */
Formatter.prototype._typeFormatters = {};


/**
 * Paragraphs and block quotes are similar, their inline elements need to be
 * unwrapped into a giant array of inline elements.
 *
 * Code blocks are a special case b/c no text processing happens within the
 * code block, so they look just like a blob of text and must be identified
 * after the fact by the fence back ticks (```).  This is so that various coding
 * language constructs do not get interpreted like markdown during parsing.
 */
Formatter.prototype._typeFormatters.paragraph =
Formatter.prototype._typeFormatters.blockquote = function (token) {
  var _this = this;
  var block = {type: token.token, inlineElements: []};
  var inlineElements = block.inlineElements;
  var codeblockRegex;
  var match;

  // Unwrap individual lines into just a long list of inline elements
  token.attributeValue.forEach(function (line) {
    if (line.attributeValue instanceof Array) {
      line.attributeValue.forEach(function (inlineElement) {
        _this._collapseText(inlineElements, inlineElement);
      });
    } else {
      _this._collapseText(inlineElements, line.attributeValue);
    }
  });

  if (inlineElements.length === 1) {
    codeblockRegex = /```((?:.|\n)*)```/;
    if (match = codeblockRegex.exec(inlineElements[0].text)) {
      block.type = 'codeblock';
      block.text = match[1];
      delete block.inlineElements;
    }
  }

  return block;
};

/**
 * Helper to collapse inline text elements with each other
 */
Formatter.prototype._typeFormatters._collapseText = function (inlineElements, inlineElement) {
  var lastElement = inlineElements[inlineElements.length - 1];

  if (lastElement && lastElement.type === 'text' && inlineElement.type === 'text') {
    lastElement.text += inlineElement.text;
  } else {
    inlineElements.push(inlineElement);
  }
};

/**
 * Unwrap the list lines from their lexer format.
 */
Formatter.prototype._typeFormatters.list = function (token) {
  var list = {type: token.token, lines: []};

  token.attributeValue.forEach(function (lineToken) {
    list.lines.push(lineToken.attributeValue);
  });

  return list;
};

/**
 * Assign the same handler for all of the header tags.
 */
Formatter.prototype._typeFormatters.h1 =
Formatter.prototype._typeFormatters.h2 =
Formatter.prototype._typeFormatters.h3 = function (token) {
  return {type: token.token, text: token.attributeValue[0].text};
};

/**
 * Just pass back an HR type tag
 */
Formatter.prototype._typeFormatters.hr = function () {
  return {type: 'hr'};
};


/**
 * All images are built as figures - not inline elements
 *
 */
Formatter.prototype._typeFormatters.figure = function (token) {
  return {
    type: token.token,
    src: token.attributeValue.src,
    title: token.attributeValue.title,
    alt: token.attributeValue.alt,
    caption: token.attributeValue.caption
  };
};

/**
 * Scripts require special syntax b/c they cannot be rendered directly in our
 * markdown engine.
 *
 */
Formatter.prototype._typeFormatters.script = function (token) {
  return {type: token.token, tag: token.attributeValue.tag};
};

module.exports = Formatter;