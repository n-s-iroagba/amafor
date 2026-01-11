module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier' // Prettier integration
  ],
  plugins: ['@typescript-eslint','eslint-plugin-tsdoc'],
  rules: {
    'complexity': ['error', 10],
    'max-lines-per-function': ['error', 50],
    '@typescript-eslint/explicit-function-return-type': 'error',
    "tsdoc/syntax": "error",

  }

};