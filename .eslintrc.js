const path = require('path')


module.exports = {
  'extends': 'airbnb-base',
  'env': {
    'browser': true,
    'es6': true,
  },
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'rules': {
    'arrow-parens': ['error', 'as-needed'],
    'camelcase': 0,
    'guard-for-in': 0,
    'import/no-unresolved': 0,
    'import/no-dynamic-require': 0,
    'linebreak-style': [
      'error',
      'unix',
    ],
    'max-len': [
      'error',
      120,
    ],
    'no-await-in-loop': 0,
    'no-console': 0,
    'no-extra-boolean-cast': 0,
    'no-mixed-operators': 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'no-useless-escape': 0,
    'operator-linebreak': [
      'error',
      'after',
    ],
    'padded-blocks': 0,
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'never',
    ],
    'space-before-function-paren': [
      'error',
      'always',
    ],
    'space-unary-ops': [
      'error',
      {
        'overrides': {
          '!': true,
        },
      },
    ],
  },
  'settings': {
    'import/resolver': {
      'node': {
        paths: [path.resolve(__dirname)],
      },
    },
  },
}
