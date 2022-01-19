
module.exports = {
  'bail': true,
  'verbose': true,
  'testRegex': './test/.*.test.js$',
  'roots': ['./'],
  'collectCoverage': true,
  'moduleNameMapper': {
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  'roots': [
    './'
  ],
  'collectCoverage': true,
  'transform': {
    './test/.*.test.js$': 'babel-jest'
  }
}

