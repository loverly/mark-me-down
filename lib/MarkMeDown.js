/**
 * The majority of the work is handled by the sub-classes within this markdown
 * parser.
 */
function MarkMeDown(config, Lexer, Parser, Formatter) {
  this._lexer = new Lexer(config);
  this._parser = new Parser(config);
  this._formatter = new Formatter(config);

  // Setup the streams as a transformation pipeline including the current object
  // (which is also a duplex stream).
  this._lexer.pipe(this._parser);
  this._parser.pipe(this._formatter);

}

/**
 * Allow others to pipe into MarkMeDown with another stream by passing back
 * the head of the transformation pipeline for: `stream.pipe(mmd.getStreamForPipe());`.
 *
 * Provide the getter to obscure the internals of the MarkMeDown transformation
 * pipeline.
 */
MarkMeDown.prototype.getStreamForPipe = function getStreamForPipe() {
  return this._lexer.getStreamForPipe();
};

/**
 * Allow people to the pipe the output at the tail-end of the pipeline
 */
MarkMeDown.prototype.pipe = function pipe(stream) {
  this._formatter.pipe(stream);
};

/**
 * Only allow events to be managed at the very end of the pipeline.  All data
 * eventually ends up there.
 *
 * TODO: Gracefully handle error events from all of the streams
 */
MarkMeDown.prototype.on = function on(event, handler) {
  this._formatter.on(event, handler);
};

module.exports = MarkMeDown;