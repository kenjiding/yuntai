module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': 'off',
    "arrow-parens": 0,
    "generator-star-spacing": 0,
    "indent": ["error", 2],
    "semi": ["error", "always"],
    "spaced-comment": 0,
    "space-before-function-paren": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
