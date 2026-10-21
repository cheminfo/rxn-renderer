import { defineConfig, globalIgnores } from 'eslint/config';
import cheminfo from 'eslint-config-cheminfo';
import globals from 'globals';

export default defineConfig(
  globalIgnores(['coverage', 'lib', 'dist']),
  cheminfo,
  { files: ['debug/**'], languageOptions: { globals: globals.browser } },
);
