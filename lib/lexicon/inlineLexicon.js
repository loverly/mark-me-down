/**
 * Used in the second pass of the lexer, it takes in a stream of tokens from the
 * character pass and transforms them into inline-level elements.
 *
 * These are things like images, links, bold, em, etc.  For larger block-level
 * elements, each line is broken
 *
 */
module.exports = {
  defaultLexeme: {
    token: 'inline',
    partialMatchAttributeValue: function (history, input) {
      history.shift();

      return {
        type: 'text',
        text: history.reduce(function (previousValue, currentValue) {
          var val;

          if (currentValue.input.token === 'text') {
            val = previousValue + currentValue.input.attributeValue;
          } else {
            val = previousValue;
          }

          return val
        }, '')
      };
    },
    attributeValue: function (history, input) {
      return {type: 'text', text: input.attributeValue};
    }
  },
  lexemes: [

    // Links / images
    {
      token: 'inline',
      pattern: [
        {token: 'open-bracket'},
        {token: 'text', repeat: true},
        {token: 'close-bracket'},
        {token: 'open-paren'},
        {token: 'close-paren', inverted: true, repeat: true},
        {token: 'close-paren'}
      ],

      /**
       * Create a link value with link text and an href
       */
      attributeValue: function (history, input) {
        var isLinkTextComplete = false;
        var linkText = '';
        var href = '';

        history.shift(); // Remove the root node
        history.shift(); // Remove the open-bracket
        history.pop(); // Remove the close-paren

        history.forEach(function (visit) {
          var token = visit.input.token;
          var attrVal = visit.input.attributeValue;

          if (token === 'close-bracket') {
            isLinkTextComplete = true;
          }
          else if (token === 'text') {

            if (isLinkTextComplete) {
              href += attrVal;
            }
            else {
              linkText += attrVal;
            }
          }
        });

        return {type: 'link', text: linkText, href: href.trim()};
      }
    },
    {
      token: 'figure',
      pattern: [
        {token: 'image-open'},
        {token: 'text', repeat: true},
        {token: 'close-bracket'},
        {token: 'open-paren'},
        {token: 'close-paren', inverted: true, repeat: true},
        {token: 'close-paren'}
      ],
      attributeValue: function (history, input) {
        var stage = 'title';
        var attrVal = {
          title: '',
          src: '',
          alt: '',
          caption: ''
        };

        history.shift(); // Remove the root node
        history.shift(); // Remove the open-bracket
        history.pop(); // Remove the close-paren

        history.forEach(function (visit) {
          var token = visit.input.token;
          var inputAttrVal = visit.input.attributeValue;

          if (token === 'close-bracket') {
            stage = 'src';
          }
          else if (token === 'double-quote') {
            stage = 'alt';
          }
          else if (token === 'open-paren') {
            // Do nothing
          }
          else {
            attrVal[stage] += inputAttrVal;
          }
        });

        attrVal.src = attrVal.src.trim(); // Trim the text for the href
        return attrVal;
      }
    },

    {
      token: 'script',
      pattern: [
        {token: 'open-script'},
        {token: 'close-script', inverted: true, repeat: true},
        {token: 'close-script'}
      ],
      attributeValue: function (history, input) {
        var tagText;

        history.shift(); // Remove the root node
        history.shift(); // Remove the open-script
        history.pop(); // Remove the close-script

        tagText = history.reduce(function (prev, curr) {
          return prev + curr.input.attributeValue;
        }, '');

        return {tag: tagText};
      }
    },

    // Inline Styles

    {
      token: 'inline',
      pattern: [
        {token: 'em'},
        {token: 'text', repeat: true},
        {token: 'newline', optional: true},
        {token: 'text', optional: true, repeat: true},
        {token: 'em'}
      ],
      attributeValue: function (history) {
        var text;

        // Remove the root, the open tag, and ending newline
        history.splice(0, 2);
        history.pop();

        text = history.reduce(function (previousValue, currentValue) {
          return previousValue + currentValue.input.attributeValue;
        }, '');

        return {type: 'em', text: text};
      }
    },
    {
      token: 'inline',
      pattern: [
        {token: 'strong'},
        {token: 'text', repeat: true},
        {token: 'newline', optional: true},
        {token: 'text', optional: true, repeat: true},
        {token: 'strong'}
      ],
      attributeValue: function (history) {
        var text;

        // Remove the root, the open tag, and ending newline
        history.splice(0, 2);
        history.pop();

        text = history.reduce(function (previousValue, currentValue) {
          return previousValue + currentValue.input.attributeValue;
        }, '');

        return {type: 'strong', text: text};
      }
    },
    {
      token: 'inline',
      pattern: [{token: 'code'}, {token: 'text', repeat: true}, {token: 'code'}],
      attributeValue: function (history) {
        var text;

        // Remove the root, the open tag, and ending newline
        history.splice(0, 2);
        history.pop();

        text = history.reduce(function (previousValue, currentValue) {
          return previousValue + currentValue.input.attributeValue;
        }, '');

        return {type: 'code', text: text};
      }
    },

    // Headers - No inline styles allowed within headers

    {
      token: 'h1-open',
      pattern: [{token: 'newline'}, {token: 'h1-open'}],
      attributeValue: passThroughAttrValGenerator
    },
    {
      token: 'h2-open',
      pattern: [{token: 'newline'}, {token: 'h2-open'}],
      attributeValue: passThroughAttrValGenerator
    },
    {
      token: 'h3-open',
      pattern: [{token: 'newline'}, {token: 'h3-open'}],
      attributeValue: passThroughAttrValGenerator
    },

    // BLOCKS
    {
      token: 'quote-open',
      pattern: [{token: 'quote-open'}],
      attributeValue: passThroughAttrValGenerator
    },
    {
      token: 'pre-open',
      pattern: [{token: 'pre-open'}],
      attributeValue: passThroughAttrValGenerator
    },
    {
      token: 'html-open',
      pattern: [{token: 'html-open'}],
      attributeValue: passThroughAttrValGenerator
    },
    {
      token: 'code-block-tag',
      pattern: [{token: 'code-block-tag'}],
      attributeValue: passThroughAttrValGenerator
    },
    {
      token: 'hr',
      pattern: [{token: 'hr', repeat: true}],
      attributeValue: null
    },

    // LISTS
    {
      token: 'ul',
      pattern: [
        {token: 'newline'},
        {token: 'indent', optional: true, repeat: true},
        {token: 'ul'}
      ],
      attributeValue: function (history) {
        return history.length - 2;
      }
    },
    {
      token: 'ol',
      pattern: [
        {token: 'newline'},
        {token: 'indent', optional: true, repeat: true},
        {token: 'ol'}
      ],
      attributeValue: function (history) {
        return history.length - 2;
      }
    },

    // Text Aggregation

    {
      token: 'inline',
      pattern: [{token: 'text', repeat: true}],
      attributeValue: function (history, input) {
        history.shift();

        return {
          type: 'text',
          text: history.reduce(function (previousValue, currentValue) {
            return previousValue + currentValue.input.attributeValue;
          }, '')
        }
      }
    },

    // Maintain Newlines for block-level processing
    {token: 'newline', pattern: [{token: 'newline'}], attributeValue: null}
  ]
};

/**
 * Return the attribute value as-is to the next level
 */
function passThroughAttrValGenerator(history, input) {
  return history.pop().input.attributeValue;
}
