/**
 * Use the Node.js fs library to create a readable stream from the corpus doc
 * and use the parser to log the token-based streaming output to the console.
 *
 * By manipulating the settings slightly, the output can be piped to a file
 * instead.
 */
var fs = require('fs');
var MarkMeDown = require('../index');

var mmd = new MarkMeDown();

mmd.on('data', function (data) {
  console.log('TOKEN:', data);
});

var stream = fs.createReadStream(__dirname + '/Corpus.md');
stream.pipe(mmd.getStreamForPipe());
