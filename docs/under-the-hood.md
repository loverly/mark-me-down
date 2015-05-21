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

The list of tokens that the lexer understands can be found in [lib/Tokens.js](/lib/Tokens.js).


## The Parser

The parser is tasked with performing __syntactic analysis__ to ensure that the
text provided follows the rules (formal grammar) and can be constructed into the
defined language constructs.

As each token type is encountered, the parser will act as a finite state machine
and try to complete 

