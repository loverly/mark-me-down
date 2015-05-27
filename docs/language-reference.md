# Language Reference

Mark-me-down supports a limited subset of the full 
[Markdown language](http://daringfireball.net/projects/markdown/syntax).
The excluded features are those that are extraneous (like multiple ways to write
lists or em/strong tags) or would require the use of variables in order to
complete the metadata.

In addition to the standard Markdown data set, the lexer is (or will be) extended
to include Loverly-specific tags.
 
* [Inline elements](#inline-elements)
  * [Text](#text)
  * [Strong](#strong)
  * [Emphasis](#emphasis)
  * [Code](#code)
  * [Links](#links)

* [Blocks](#blocks)
  * [Paragraphs](#paragraphs)
  * [Headings](#headings)
  * [Figures](#figures)
  * [Lists](#lists)
  * [Code Blocks](#code-blocks)
  * [Scripts](#scripts)
  * [Raw HTML](#raw-html)


# Main Differences Between Loverly Markdown and Standard Markdown

There are a few key differences:


### No support for nesting of inline elements

You cannot have strong/emphasis within links or within each other.  In Loverly's
context, we have a very strict style guide so this feature is unncessary and leads
to potential infinite recursion of inline elements.  By requiring that inline
elements not be nested we drastically simplify the markup of paragraphs and blocks
of text in general.


### No support for variables

In standard markdown it is possible to set an image source url as a named variable
and then reference it later within the document.  In our modified syntax this is
not possible.  This is because MarkMeDown is more of a lexer (translator) than a 
full parser.  It does not create a syntax tree or a symbol table to track state
or complex rules/analysis.


### Custom dialect

In addition to normal markdown, mark-me-down also provides support for a set
of custom tags that allow us to simplify our editorial writing strategy.  Widgets,
scripts, iframes are some of the things included in our syntax that is atypical.


### Images as figures

This library does not support inline images (we have no use-case for this 
internally), instead it uses a modified syntax to provide a more robust way to
specify a block-level figure element that allows for an alt, title, figcaption,
and height/width.


### Fewer syntax options for specifying styles

Rather than having both `_` and `*` to specify strong / em styles, this has been
stripped down to just underscores.  Also, lists, which normally can be specified
by `-`, `*`, `+` are now limited to just `*`.  There's no technical reason for
this, but the standardization provides consistency for our editorial team.


# Inline Elements

Inline elements are the building blocks upon which all of the higher level
elements are composed.  Each element has a `type` field to identify it, and then
type-specific traits 

### Text

Text is just normal text.  It is represented as:

```json
{type: 'text', text: 'my cool text here'}
```

### Strong

Strong text is text that carries extra weight within the document.  It is typically
represented by `<strong>` tags within HTML.

Strong text is specified via double underscores around strong text.

    My awesome __strong__ text


### Emphasis

Emphasized text is text that is typically represented with an italic font to
indicate that it is distinct from normal text.  It is typically represented by 
`<em>` tags within HTML.

Emphasized text is defined using single underscores around text.

    My _emphasized_ text



### Code

Inline code is used specifically for code within text.  It is typically 
represented by `<code>` tags within HTML.  This is different from a code block
which would actually be represented by `<pre><code></code></pre>` as a block-level
element versus just a code inline element.

Inline code elements are specified by surrounding text with back-ticks `\``

    For example see how variables are set: `var a = 123;`


### Links

Links are a (very) slightly more complicated inline element because they have
the most options to specify.  This is your typical anchor link within HTML (`<a>`
tag).  In general it is composed of text and a target href.

Currently there is no support for a title attribute for the link or any styling
options.

    [my link text](http://lover.ly)


# Blocks

Blocks are composed of inline elements and sometimes even lines of inline elements
(as in the case of a list).  Blocks are units within the document and by far the
most prevalent block will be either a vanilla paragraph or figures.


### Paragraphs

This is the default block element.  Unless you are using some other special syntax
it will be a paragraph.  To break things into separate paragraphs, just add an
extra line break between paragraphs of text.


### Headings

We support H1-H3 heading tags (instead of up to H6).  These are section titles
and should be thought of as part the imaginary document outline.  The levels
1-3 are indicated by a leading hash tag on a line.

    # My h1 heading
    ## My h2 heading


### Figures

Figures are specified using the image syntax within markdown.  This will be
extended in future iterations to be able to specify the figcaption and dimensions
of the image to enable further customizability.

    ![My link alt text here](http://my-image.com/source.jpg "my title text")


### Lists

Support for unordered lists and ordered lists is available.  Unordered lists are
indicated with a leading `*` and ordered lists are created with a literal `1.`.
The use of `<ul>` and `<ol>` will create bullets and correct number sequences
in browsers.


     * My unordered list
     * Has a few lines

     1. My ordered lists
     1. Will have the right numbers
     1. even though they all say "1."


### Code Blocks

Code blocks are created by surrounding a block of code with triple back ticks 
\`\`\`.

    ```
      var a = 123;
      var c = a + b;
    ```


### Scripts

Our templating engine does not allow for raw script tags so having a specialized
javascript object that indicates we need a script tag in the markup is important
for us.

These can be added via:

    {{script: async defer src="http://mydomain.com/myscript.js"}}

Basically everything that comes after the `:` is what goes into the script
tag attributes as-is.


### Raw HTML

Raw HTML should be surrounded by `%%%` fencing.  This is not standard within
the Markdown syntax (HTML can be embedded inline) but I think stricter rules
make it easier to identify where raw HTML is being used to validate whether the
HTML used is acceptable or not.
