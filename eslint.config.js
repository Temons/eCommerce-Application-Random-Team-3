import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    ignores: ['webpack.config.js', 'dist/**', 'node_modules/**'],
  },

  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },
];
