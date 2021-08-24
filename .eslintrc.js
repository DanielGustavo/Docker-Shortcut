module.exports = {
  env: {
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'off',
    'class-methods-use-this': 'off',
    'no-undef': 'off',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'no-var': 'off',
    'vars-on-top': 'off',
    'prefer-spread': 'off',
    'no-bitwise': 'off',
    'no-prototype-builtins': 'off',
  },
};
