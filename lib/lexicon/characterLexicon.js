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
  specialCharacters: [
    '`(?!`)',
    '_{1,2}',
    '\\!\\[',
    '\\[',
    '\\]',
    '\n>',
    '\n',
    '\\(',
    '\\)',
    '"',
    '`',
    '\\*',
    '1\\.',
    '#{1,3}',
    '\\\\.',
    ' {4}',
    '\\{\\{script:',
    '\\}\\}',

    // Fenced blocks - handled by the parser
    '```(.|\n)+?```',
    '%%%(.|\n)+?%%%'
  ],
  // There should be nothing but the special character sequences or text
  defaultLexeme: {
    token: 'text',
    isDefault: true,

    // Used when a pattern is partially matched, but then aborted
    partialMatchAttributeValue: function (history, input) {
      // TODO: Should not hit this
      return input.attributeValue;
    },

    // Used when a non-special character is encountered
    attributeValue: function (history, input) {
      return input.attributeValue;
    }
  },
  lexemes: [

    // Links/images
    {token: 'image-open', pattern: [{token: '!['}], attributeValue: '!['},
    {token: 'open-bracket', pattern: [{token: '['}], attributeValue: '['},
    {token: 'close-bracket', pattern: [{token: ']'}], attributeValue: ']'},
    {token: 'open-paren', pattern: [{token: '('}], attributeValue: '('},
    {token: 'close-paren', pattern: [{token: ')'}], attributeValue: ')'},
    {token: 'double-quote', pattern: [{token: '"'}], attributeValue: '"'},

    {token: 'open-script', pattern: [{token: '{{script:'}], attributeValue: '{{script:'},
    {token: 'close-script', pattern: [{token: '}}'}], attributeValue: '}}'},

    // Inline styles
    {token: 'em', pattern: [{token: '_'}], attributeValue: '_'},
    {token: 'strong', pattern: [{token: '__'}], attributeValue: '__'},
    {token: 'strong', pattern: [{token: '**'}], attributeValue: '**'},
    {token: 'code', pattern: [{token: '`'}], attributeValue: '`'},

    // Whitespace
    {token: 'newline', pattern: [{token: '\n'}], attributeValue: ' '},

    // HEADERS
    {token: 'h1-open', pattern: [{token: '#'}], attributeValue: '#'},
    {token: 'h2-open', pattern: [{token: '##'}], attributeValue: '##'},
    {token: 'h3-open', pattern: [{token: '###'}], attributeValue: '###'},

    // Blocks
    {token: 'indent', pattern: [{token: '    '}], attributeValue: '    '},
    {token: 'quote-open', pattern: [{token: '\n>'}], attributeValue: '>'},
    {token: 'hr', pattern: [{token: '---'}], attributeValue: null},
    {token: 'html-open', pattern: [{token: '%%%'}], attributeValue: ''},

    // Lists
    {token: 'ul', pattern: [{token: '*'}], attributeValue: '*'},

    // Escape sequences for literal versions of special chars

    {token: 'text', pattern: [{token: '\\\\'}], attributeValue: '\\'},
    {token: 'text', pattern: [{token: '\\`'}], attributeValue: '`'},
    {token: 'text', pattern: [{token: '\\*'}], attributeValue: '*'},
    {token: 'text', pattern: [{token: '\\_'}], attributeValue: '_'},
    {token: 'text', pattern: [{token: '\\['}], attributeValue: '['},
    {token: 'text', pattern: [{token: '\\]'}], attributeValue: ']'},
    {token: 'text', pattern: [{token: '\\('}], attributeValue: '('},
    {token: 'text', pattern: [{token: '\\)'}], attributeValue: ')'},
    {token: 'text', pattern: [{token: '\\#'}], attributeValue: '#'},
    {token: 'text', pattern: [{token: '\\+'}], attributeValue: '+'},
    {token: 'text', pattern: [{token: '\\-'}], attributeValue: '-'},
    {token: 'text', pattern: [{token: '\\"'}], attributeValue: '"'},
    {token: 'text', pattern: [{token: '\\!'}], attributeValue: '!'}
  ]
};