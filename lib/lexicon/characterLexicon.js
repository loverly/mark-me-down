/**
 * Defines a series of special character sequences that can be transformed into
 * tokens for further higher-level processing.
 *
 * This is definitely a very small subset of the complete markdown lexicon because
 * we are building a much stricter syntax for the Loverly team.
 *
 */
module.exports = {
  mode: 'string',
  defaultLexeme: {
    token: 'text',
    isDefault: true,

    // Used when a pattern is partially matched, but then aborted
    partialMatchAttributeValue: function (history, input) {
      var attrVal;
      history.shift(); // Remove the root node

      attrVal = history.reduce(function (previousValue, currentValue) {
        return previousValue + currentValue.input.token;
      }, '');

      return attrVal;
    },

    // Used when a non-special character is encountered
    attributeValue: function (history, input) {
      return input.token;
    }
  },
  lexemes: [

    // Links/images
    {token: 'image-open', pattern: '![', attributeValue: '!['},
    {token: 'open-bracket', pattern: '[', attributeValue: '['},
    {token: 'close-bracket', pattern: ']', attributeValue: ']'},
    {token: 'open-paren', pattern: '(', attributeValue: '('},
    {token: 'close-paren', pattern: ')', attributeValue: ')'},
    {token: 'double-quote', pattern: '"', attributeValue: '"'},

    // Inline styles
    {token: 'em', pattern: '_', attributeValue: '_'},
    {token: 'strong', pattern: '__', attributeValue: '__'},
    {token: 'strong', pattern: '**', attributeValue: '**'},
    {token: 'code', pattern: '`', attributeValue: '`'},

    // Whitespace
    {token: 'newline', pattern: '\n', attributeValue: ' '},

    // HEADERS
    {token: 'h1-open', pattern: '\n#', attributeValue: '#'},
    {token: 'h2-open', pattern: '\n##', attributeValue: '##'},
    {token: 'h3-open', pattern: '\n###', attributeValue: '###'},

    // Blocks
    {token: 'quote-open', pattern: '\n>', attributeValue: '>'},
    {token: 'code-block-tag', pattern: '\n```', attributeValue: '```'},
    {
      token: 'hr',
      pattern: [
        {token: '\n'},
        {token: '-'},
        {token: '-', repeat: true}
      ],
      attributeValue: null
    },

    // Lists
    {
      token: 'ul',
      pattern: [
        {token: '\n'},
        {token: ' ', repeat: true},
        {token: '*'}
      ],
      attributeValue: function (history) {
        history.shift(); // Remove root
        history.pop(); // Remove '*' node
        var spaces = history.length || 1;
        return Math.floor(spaces / 2); // Indentation levels
      }
    },
    {token: 'ol', pattern: '\n1. ', attributeValue: '1. '},

    // Escape sequences for literal versions of special chars

    {token: 'text', pattern: '\\\\', attributeValue: '\\'},
    {token: 'text', pattern: '\\`', attributeValue: '`'},
    {token: 'text', pattern: '\\*', attributeValue: '*'},
    {token: 'text', pattern: '\\_', attributeValue: '_'},
    {token: 'text', pattern: '\\[', attributeValue: '['},
    {token: 'text', pattern: '\\]', attributeValue: ']'},
    {token: 'text', pattern: '\\(', attributeValue: '('},
    {token: 'text', pattern: '\\)', attributeValue: ')'},
    {token: 'text', pattern: '\\#', attributeValue: '#'},
    {token: 'text', pattern: '\\+', attributeValue: '+'},
    {token: 'text', pattern: '\\-', attributeValue: '-'},
    {token: 'text', pattern: '\\!', attributeValue: '!'}
  ]
};