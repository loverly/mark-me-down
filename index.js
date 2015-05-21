/**
 * Provide a basic dependency-injection wrapper around the library's components
 * to simplify unit testing (by allowing mocks to be used instead).
 *
 * This allows the user to see a nice clean interface, but still have the benefits
 * of dependency injection.  The other option would be to provide an object with
 * different factory methods but I see no need for that.
 *
 * Also, with this pattern, none of the sub-classes are exposed externally, which
 * at this point makes sense because they are not individually useful.
 */
module.exports = (function () {

  var Lexerific = require('lexerific');
  var characterLexicon = require('./lib/lexicon/characterLexicon');
  var inlineLexicon = require('./lib/lexicon/inlineLexicon');
  var lineLexicon = require('./lib/lexicon/lineLexicon');
  var blockLexicon = require('./lib/lexicon/blockLexicon');

  var MarkMeDown = require('./lib/MarkMeDown');
  var Lexer = require('./lib/Lexer');
  var Parser = require('./lib/Parser');
  var Formatter = require('./lib/Formatter');

  function LexerFactory(config) {
    config = config || {};

    // Provide a default set of lexicons if none were provided
    config.lexicons = config.lexicons || [
      characterLexicon,
      inlineLexicon,
      lineLexicon,
      blockLexicon
    ];

    return new Lexer(config, Lexerific);
  }

  return function MarkMeDownFactory(config) {
    return new MarkMeDown(config, LexerFactory, Parser, Formatter);
  };
}());