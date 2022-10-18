/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier'
  ],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'always'
      }
    ],
    'prettier/prettier': [
      'error',
      {
        semi: false,
        singleQuote: true,
        vueIndentScriptAndStyle: true,
        trailingComma: 'none',
        printWidth: 90
      }
    ],
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off'
  }
}
