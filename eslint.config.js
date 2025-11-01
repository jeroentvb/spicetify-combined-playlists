import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import jeroentvbEslintConfig from '@jeroentvb/eslint-config-typescript';
import react from 'eslint-plugin-react';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

/** @type {import("eslint").Linter.Config[]} */
export default ts.config(
   includeIgnoreFile(gitignorePath),
   js.configs.recommended,
   // ...ts.configs.recommended,
   ...jeroentvbEslintConfig,
   // {
   //    languageOptions: {
   //       globals: { ...globals.browser, ...globals.node }
   //    },
   //    rules: { // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
   //       // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
   //       'no-undef': 'off'
   //    }
   // },
   {
      files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
      plugins: {
         react,
      },
      languageOptions: {
         parserOptions: {
            ecmaFeatures: {
               jsx: true,
            },
         },
         globals: {
            ...globals.browser,
         },
      },
      // rules: { // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
      //    // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
      //    'no-undef': 'off'
      // }
   }
);
