/**
 * Aggregate the inline-styled elements into lines, which will be turned into
 * blocks further upstream.
 *
 */
module.exports = {
  defaultLexeme: null, // Ignore newlines that are part of a paragraph
  lexemes: [
    // Inline elements pass-through
    {
      token: 'paragraph-line',
      pattern: [
        {token: 'inline'}
      ],
      attributeValue: function (history) {
        return history.pop().input.attributeValue;
      }
    },

    // line-break
    {
      token: 'paragraph-break',
      pattern: [{token: 'newline'}, {token: 'newline'}],
      attributeValue: null
    },

    // Headers - No inline styles allowed within headers

    {
      token: 'h1',
      pattern: [
        {token: 'h1-open'},
        {token: 'inline', repeat: true}
      ],
      attributeValue: fencedInlineBlockAttributeGenerator
    },
    {
      token: 'h2',
      pattern: [
        {token: 'h2-open'},
        {token: 'inline', repeat: true}
      ],
      attributeValue: fencedInlineBlockAttributeGenerator
    },
    {
      token: 'h3',
      pattern: [
        {token: 'h3-open'},
        {token: 'inline', repeat: true}
      ],
      attributeValue: fencedInlineBlockAttributeGenerator
    },

    // BLOCKS

    {
      token: 'quote-line',
      pattern: [
        {token: 'quote-open'},
        {token: 'inline', repeat: true}
      ],
      attributeValue: fencedInlineBlockAttributeGenerator
    },
    {
      token: 'pre-line',
      pattern: [
        {token: 'pre-open'},
        {token: 'inline', repeat: true}
      ],
      attributeValue: fencedInlineBlockAttributeGenerator
    },
    {
      token: 'hr',
      pattern: [{token: 'hr', repeat: true}, {token: 'newline'}],
      attributeValue: null
    },
    {
      token: 'code-block-tag',
      pattern: [{token: 'code-block-tag'}],
      attributeValue: null
    },
    {
      token: 'figure',
      pattern: [{token: 'figure'}],
      attributeValue: function (history) {
        return history.pop().input.attributeValue;
      }
    },

    // LISTS
    {
      token: 'list-line',
      pattern: [
        {token: 'ul'},
        {token: 'inline', repeat: true}
      ],
      attributeValue: function (history) {
        var indentationLevel;
        var inlineElements; // Pieces of text, links, images, that make up this line

        history.shift(); // Remove the root
        indentationLevel = history.shift().input.attributeValue; // ul token
        inlineElements = history.map(function (visit) {
          return visit.input.attributeValue;
        });

        return {type: 'ul', level: indentationLevel, inlineElements: inlineElements};
      }
    },
    {
      token: 'list-line',
      pattern: [
        {token: 'ol'},
        {token: 'inline', repeat: true}
      ],
      attributeValue: function (history) {
        var indentationLevel;
        var inlineElements; // Pieces of text, links, images, that make up this line

        history.shift(); // Remove the root
        indentationLevel = history.shift().input.attributeValue; // ul token
        inlineElements = history.map(function (visit) {
          return visit.input.attributeValue;
        });

        return {type: 'ol', level: indentationLevel, inlineElements: inlineElements};
      }
    }
  ]
};

/**
 * A helper function for generating the attribute value for tags that start
 * and end with a tag.
 */
function fencedInlineBlockAttributeGenerator (history) {
  // Remove the root, the open tag, and ending newline
  history.splice(0, 2);

  return history.map(function (visit) {
    return visit.input.attributeValue;
  });
}
