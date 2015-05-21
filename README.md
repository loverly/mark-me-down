# Disclaimer

**HIGHLY EXPERIMENTAL: USE AT YOUR OWN RISK**

Currently suffers from:

* Does not support full markdown language features
* Performance (50x slower than `marked`)
* Outputs only objects (no HTML renderer, formatter)


# Mark Me Down

A utility to parse a modified markdown dialect into an object representation 
that can stored or rendered to HTML.

This model was created to support the creation of pre-parsed structured data
that could then be parsed by a custom HTML renderer in Loverly's Node.js platform.
 
Pre-parsing into an object structure prevents us from having to compile markdown
on-the-fly every time we want to render one of our blog articles while having
an output agnostic data structure allows us to render to multiple output formats
without having to change our compiler.

The syntax is a heavily redacted subset of the actual Markdown language with
Loverly-specific objects introduced for the editorial team to create flexible
and beautiful blog content.

**THIS IS NOT AN HTML GENERATOR**  

If you are looking for something to generate HTML from a Markdown file, try
the npm library [marked](https://www.npmjs.com/package/marked) instead.


# Usage

There currently isn't much (any) configuration options for the parser.  In the
future it may be possible to setup the parser in more meaningful ways, but I
haven't found a need for it yet.

```javascript
var fs = require('fs');
var MarkMeDown = require('../index');

var mmd = new MarkMeDown();

mmd.on('data', function (data) {
  console.log('TOKEN:', data);
});

var stream = fs.createReadStream(__dirname + '/ShortCorpus.md');
stream.pipe(mmd.getStreamForPipe());
```


## Data Structure of Output

The output structure of the objects is type dependent.  The various output formats
with examples can be found in the [object type reference](/docs/object-type-reference.md).

## Library Internals

The MarkMeDown library implements a lexer that runs through multiple passes
via the streams pipeline API.  Read more about how this works in the
[Under the Hood Guide](/docs/under-the-hood.md).


