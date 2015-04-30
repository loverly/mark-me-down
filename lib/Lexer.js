/**
 * The Lexer is just a wrapper around a series of [Lexerific](https://github.com/loverly/lexerific)
 * instances that tokenize the output in various ways.
 *
 * Simplifies the process of setting up the stream pipeline.
 *
 */
function Lexer(config, Lexerific) {
  this._lexicons = config.lexicons;
  this._Lexerific = Lexerific;

  this._scanners = []; // An array of initialized lexerific instances

  this._setupPipeline(); // Setup the series of lexers
}

/**
 * Setup the stream transformation pipeline based on the various character
 * sets.
 *
 * Assume that the first lexicon is character-based and should be in `string`
 * mode, vs subsequent lexicons, which will be in `token` mode.
 */
Lexer.prototype._setupPipeline = function setupPipeline() {
  var _this = this;
  var previousStream;

  this._lexicons.forEach(function (lexicon, index) {
    var scanner = new _this._Lexerific({mode: lexicon.mode || 'token'});

    // Add the lexicon (including the default)
    if (lexicon.defaultLexeme) {
      scanner.setDefaultLexeme(lexicon.defaultLexeme);
    }

    scanner.addLexemes(lexicon.lexemes);
    _this._scanners.push(scanner);
  });

  // Add the character scanner to the head of the line
  //var CharacterLexer = require(__dirname + '/CharacterLexer');
  //this._scanners.unshift(new CharacterLexer());
  //this._scanners = [new CharacterLexer()];

  // Set the final scanner to be used to pipe into other output streams
  this._finalScanner = this._scanners[this._scanners.length - 1];

  // Loop through the streams and pipe them into each other
  this._scanners.forEach(function (scanner) {
    if (previousStream) {
      previousStream.pipe(scanner);
    }

    previousStream = scanner;
  });
};

/**
 * Return the head of the pipeline to allow callers to pipe input data into
 * the transformation chain.
 */
Lexer.prototype.getStreamForPipe = function getStreamForPipe() {
  return this._scanners[0];
};

/**
 * Allow external clients to add another stream to the tail-end of the transformation
 * pipeline.
 */
Lexer.prototype.pipe = function pipe(stream) {
  this._scanners[this._scanners.length - 1].pipe(stream);
};

module.exports = Lexer;