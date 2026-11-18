import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

import tsParser from '@typescript-eslint/parser';
import tsEslint from 'typescript-eslint';
import jestPlugin from 'eslint-plugin-jest';
import unusedImports from 'eslint-plugin-unused-imports';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactPlugin from 'eslint-plugin-react';

import type { Linter } from 'eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends('plugin:prettier/recommended'),
  ...compat.extends('plugin:react/recommended'),
  ...compat.extends('plugin:react-hooks/recommended'),
  ...compat.extends('plugin:import/recommended'),
  ...compat
    .extends('plugin:@typescript-eslint/recommended-type-checked')
    .map((config) => ({
      ...config,
      files: ['src/**/*.ts', 'src/**/*.tsx', 'pages/**/*.js'],
    })),
  reactCompiler.configs.recommended,
  {
    ignores: ['!.*rc.js', 'dist', '.rollup.cache'],
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx', 'pages/**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
        tsconfigRootDir: __dirname,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },
    },
    settings: {
      react: {
        version: '16.8',
      },
      'import/resolver': {
        typescript: {},
      },
    },
    plugins: {
      jest: jestPlugin,
      'unused-imports': unusedImports,
      react: reactPlugin,
      '@typescript-eslint': tsEslint.plugin,
    },
    rules: {
      'react/prop-types': 'off',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
    },
  },
] satisfies Linter.Config[];
