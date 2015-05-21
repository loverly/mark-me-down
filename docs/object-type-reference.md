# Object Type Reference

* [Inline elements](#inline-elements)
  * Text
  * Strong
  * Emphasis
  * Code
  * Links

* [Blocks](#blocks)
  * [Paragraphs](#paragraphs)
  * [Headings](#headings)
  * [Figures](#figures)
  * [Lists](#lists)
  * [Code Blocks](#code-blocks)
  * [Scripts](#scripts)

# Inline Elements

Inline elements are contained within other block-level elements.  They never
appear independently.


## Text / Strong / Emphasis / Code

All of these elements follow the general format:

```json

{
  type: 'text|strong|em|code',
  text: 'the text within the element'
}

```


## Links

```json

{ type: 'link', text: 'link', href: 'http://lover.ly' }

```


# Paragraphs

The basic building block for any document - the paragraph contains an array of
inline elements (text, strong text, emphasized text, links, etc).

```json

{ 
  type: 'paragraph',
  inlineElements: [ 
    { type: 'text', text: 'what about some ' },
    { type: 'code', text: 'code' } 
  ] 
}

```


# Headings

```json

{ 
  type: 'h1',
  text: 'My Section Heading'
}

```


# Figures

```json

{ 
  type: 'figure',
  src: 'https://cdn.com/my-image.jpg',
  title: 'via Lover.ly',
  alt: '',
  caption: 'Something will go into a caption'
}

```


# Lists

One thing to note is that list lines are not recursively nested, they just have
a level field indicating their level of nesting within the table.  If 


```json

{ 
  type: 'list',
  lines: [ 
    { type: 'ul', level: 1, inlineElements: [] },
    { type: 'ul', level: 2, inlineElements: [] },
    { type: 'ul', level: 3, inlineElements: [] },
    { type: 'ol', level: 2, inlineElements: [] } 
  ] 
}


```


# Code Blocks

Code blocks store their text as-is including newline characters

```json

{ 
  type: 'codeblock',
  text: '\n    hello\n    goodbye\n  * hello\n  * goodbye\n  __with__ _cool_ **stuff**\n  \n  \n  \n' 
}

```


# Scripts

```json

{ 
  type: 'script',
  tag: ' async defer src="http://google.com/some_js__with__chars.js"' 
}

```