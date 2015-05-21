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


## Usage APIs

* Event Emitter
* Streams API
* Big Bang


## Data Structure of Output

The output structure of the markdown elements all have a `type` property that
denotes the type of the object, a `flags` property that just has the value of
the `type` field as a key and its value set to true (for mustache/handlebars-esque
templating engines that strictly enforce logic-free templates, to allow a
switch statement to be built).

```json
{
  "type": "paragraph",
  "flags": {"paragraph": true},
  "chunks": [
    {"type": "text", "text": "My markdown paragraph with a "},
    {"type": "link", "text": "link", "href": "http://lover.ly", }
    {"type": "text", "text": ". My paragraph also contains some "},
    {"type": "strong-text", "text": "bold text"},
    {"type": "text", "text": " as well as "},
    {"type": "emphatic-text", "text": "some emphatic phrases"},
    {"type": "text", "text": "."},
  ]
}
```

The other attributes of the object are type-specific.  A complete listing of
the available types and their corresponding attributes can be found in the
[object type reference](/docs/object-type-reference.md).


## Library Internals

The MarkMeDown library implements a compiler pattern with a lexer and a parser.
It does not create a formal Abstract Syntax Tree because this library does not 
perform any semantic analysis.  Rather it outputs the results of applying the
grammar directly to the structured objects given above.  For more details
checkout the [Under the Hood Guide](/docs/under-the-hood.md).


