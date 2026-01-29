export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        es2024: true,
        node: true,
        jest: true,
      },
    },
    rules: {
      'semi': ['error', 'never'],
      'no-unused-vars': 'warn',
      'no-console': 'off',
    }
  }
]