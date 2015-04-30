/**
 * Use the Node.js fs library to create a readable stream from the corpus doc
 * and use the parser to log the token-based streaming output to the console.
 *
 * By manipulating the settings slightly, the output can be piped to a file
 * instead.
 */
var fs = require('fs');
var MarkMeDown = require('../index');
var startTime = new Date();
var marked = require('marked');


function parseFileWithMmd(count) {
  process.stdout.write('.');

  if (count > 20) {
    process.stdout.write('\n');
    var time = (Date.now() - startTime.getTime()) / 1000;
    console.log('Completed in ' + time + ' secs');
    startTime = new Date();
    parseFileWithMarked(0);
    return;
  }

  var mmd = new MarkMeDown();
  mmd.on('finish', function () {
    count++;
    parseFileWithMmd(count);
  });

  var stream = fs.createReadStream(__dirname + '/Corpus.md');
  stream.pipe(mmd.getStreamForPipe());
}


function parseFileWithMarked(count) {
  process.stdout.write('.');

  if (count > 20) {
    process.stdout.write('\n');
    var time = (Date.now() - startTime.getTime()) / 1000;
    console.log('Completed in ' + time + ' secs');
    return;
  }

  var markdownString = fs.readFileSync(__dirname + '/Corpus.md').toString();
  marked.setOptions({});

  // Using async version of marked
  marked(markdownString);

  count++;
  parseFileWithMarked(count);
}


parseFileWithMmd(0);