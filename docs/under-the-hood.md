# Under the Hood

A deep dive into the structure and operation of the code.

    Flow Diagram:

       User   |  Mark Me Down                  |  User
              |                                |
      Input   |                                |
      Stream  |  Lexer    Parser    Formatter  |   Client
        * ----|--- * ------- * -------- * -----|---- *
              |                                |

This compiler is built specifically for Node.js and makes use of Node's streams
API to pipe data from the lexer to the parser to release memory as soon as possible.


## The Lexer

The lexer takes in either a string of text or a stream of UTF-8 text.  It lexes
the code by breaking it down into string tokens corresponding to as large a lexical
unit as possible.

For example the string `see Shadow run` would be lexed into a single token of
structure:

```json
{
  "type": "text",
  "token": "see Shadow run"
}
```

because the entire string has no special markup and can be read as a single chunk
within Markdown.  Contrast that with `see __Shadow__ run`, which would result in:

```json
[
  {
    "type": "text",
    "token": "see "
  },
  {
    "type": "em-marker",
    "token": "__"
  },
  {
    "type": "text",
    "token": "Shadow"
  },
  {
    "type": "em-marker",
    "token": "__"
  },
  {
    "type": "text",
    "token": " run"
  }
]
```

Where the lexer just understands `__` to be an indicator of emphasized text, either
opening or closing.  The lexer makes no claims on whether or not the text provided
is syntactically correct, which is the job of the parser.

The lexer actually works in multiple passes (5 to be exact).  The first step is
to discriminate between special characters from regular text and transform those
special characters into tokens.  After that, each level is a higher level of aggregation
moving from individual characters, to inline elements, to lines, then to blocks
or paragraphs.

The successive lexing makes identifying special sequences at different levels
easier to manage.  It will also be very effective at processing content when the
input source is streaming (as in an HTTP / AJAX request, or from a file server
elsewhere).


## The Parser

The parser is tasked with performing __syntactic analysis__ to ensure that the
text provided follows the rules (formal grammar) and can be constructed into the
defined language constructs.

Because of the modifications we've done to the markdown syntax, there are really
no invalid or disallowed character sequences.  In the case of partial or invalid
matches the characters are simply reverted to text.  This means that our "parser"
stage doesn't actually do anything.  Right now it's just a pass-through transformer.

If we update our dialect to have stricter requirements about what is allowed or
disallowed, we would add those rules into the parser.


## The Formatter

The formatter takes the natural lexer output (`token` and `attributeValue` keys)
and maps it to more semantically meaningful keys and structures.

See the [object type reference](/docs/object-type-reference.md) for more
details.