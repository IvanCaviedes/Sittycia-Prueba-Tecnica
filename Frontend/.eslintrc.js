module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true, // Habilita características de ES2021
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021, // Usa ECMAScript 2021
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    // Reglas de ESLint recomendadas
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    'no-redeclare': 'error',
    eqeqeq: ['error', 'always'],
    'no-magic-numbers': ['warn', { ignore: [0, 1] }],
    'consistent-return': 'error',
    curly: ['error', 'all'],

    // Reglas de TypeScript
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/no-inferrable-types': 'off',

    // Reglas de Prettier
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
        semi: true,
        tabWidth: 2,
        useTabs: false,
      },
    ],

    // Reglas de orden de importaciones
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc' /* 'asc' | 'desc' */,
          caseInsensitive: true,
        },
      },
    ],
  },
};
