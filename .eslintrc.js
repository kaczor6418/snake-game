module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    createDefaultProgram: true,
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended' // Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    'no-eval': 2,
    '@typescript-eslint/no-shadow': 2,
    //ignored
    'no-shadow': 0,
    '@typescript-eslint/no-namespace': 0,
  }
};
