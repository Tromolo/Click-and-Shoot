import eslintPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'ios/**', 'android/**'], // Ignorované cesty
    files: ['**/*.js', '**/*.ts'], // Definuje súbory na kontrolu
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
      },
      parser: parser,
    },
    plugins: {
      '@typescript-eslint': eslintPlugin,
    },
    rules: {
      'no-unused-vars': 'off', // Ignoruje globálne chyby
      '@typescript-eslint/no-unused-vars': ['error'], // Prísnejšia kontrola v TypeScripte
      'no-console': 'warn', // Konzola len ako varovanie
    },
  },
];
