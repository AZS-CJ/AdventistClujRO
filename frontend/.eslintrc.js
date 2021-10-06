module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },
  settings: {
    'import/resolver': 'webpack'
  },
  rules: {
    'arrow-parens': ['error', 'always'],
    'space-before-function-paren': 0,
    'comma-dangle': ['error', 'never'],
    'linebreak-style': ['error', 'unix'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-underscore-dangle': 0,
    'prettier/prettier': 'error',
    'unified-signatures': 0,
    'no-unnecessary-type-assertion': 0,
    '@typescript-eslint/no-namespace': 'off',
    'no-console': 'error'
  }
}
