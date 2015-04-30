/**
 * The last pass of the lexer, transforms the inline-level token stream and
 * transforms them into blocks of text.  These include sections, paragraphs,
 * images, tables, etc.
 *
 */
module.exports = {
  // Ignore paragraph breaks - they're just there to create new paragraph blocks
  // Also ignore unmatched code-blocks
  defaultLexeme: {
    token: 'IGNORE',
    partialMatchAttributeValue: function (history, input) {},
    attributeValue: function (history, input) {}
  },
  lexemes: [
    // Headings pass through
    {
      token: 'h1',
      pattern: [{token: 'h1'}],
      attributeValue: passThroughAttrValGenerator
    },
    {
      token: 'h2',
      pattern: [{token: 'h2'}],
      attributeValue: passThroughAttrValGenerator
    },
    {
      token: 'h3-open',
      pattern: [{token: 'h3'}],
      attributeValue: passThroughAttrValGenerator
    },

    // HR passes through
    {
      token: 'hr',
      pattern: [{token: 'hr', repeat: true}],
      attributeValue: null
    },

    // Text blocks
    {
      token: 'paragraph',
      pattern: [{token: 'paragraph-line', repeat: true}],
      attributeValue: lineAggregator
    },
    {
      token: 'blockquote',
      pattern: [{token: 'quote-line', repeat: true}],
      attributeValue: lineAggregator
    },
    {
      token: 'code-block',
      pattern: [
        {token: 'code-block-tag'},
        {token: 'paragraph-line', repeat: true},
        {token: 'code-block-tag'}
      ],
      attributeValue: function (history) {
        // Remove the root node and the start/end tags
        history.splice(0, 2);
        history.pop();

        // Transform the history to remove the state and focus only on the tokens
        return history.map(function (visit) {
          return visit.input;
        });
      }
    },

    // TODO: Handle nesting within lists
    {
      token: 'list',
      pattern: [{token: 'list-line', repeat: true}],
      attributeValue: lineAggregator
    }
  ]
};

/**
 * Return the attribute value as-is to the next level
 */
function passThroughAttrValGenerator(history, input) {
  return history.pop().input.attributeValue;
}

/**
 * For block-level elements, aggregate the lines into single blocks
 */
function lineAggregator(history) {
  history.shift(); // Remove the root node

  // Transform the history to remove the state and focus only on the tokens
  return history.map(function (visit) {
    return visit.input;
  });
}