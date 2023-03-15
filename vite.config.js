import path from 'path';

import { defineConfig } from 'vite';

import eslint from 'vite-plugin-eslint';
import stylelint from 'vite-plugin-stylelint';

import postcssCombineMediaQuery from 'postcss-combine-media-query';
import postcssCombineDuplicatedSelectors from 'postcss-combine-duplicated-selectors';
import postCssNormalize from 'postcss-normalize';

const projectDir = path.dirname(new URL(import.meta.url).pathname);
const srcDir = path.resolve(projectDir, './src');
const outDir = path.resolve(projectDir, './dist');

const INPUTS = [
    '@/styles/lobby/lobby.scss',
    '@/scripts/palette.js',
    '@/styles/palette/palette.scss',
    '@/scripts/game.js',
    '@/styles/game/game.scss',
];

export default defineConfig({
  root: srcDir,
  build: {
    outDir,
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: INPUTS.map(i => i.replace(/^@/, srcDir)),
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssCombineMediaQuery,
        postcssCombineDuplicatedSelectors,
        postCssNormalize,
      ],
    },
  },
  resolve: {
    alias: [{
      find: '@',
      replacement: srcDir,
    },
    {
      find: '#shared',
      replacement: path.resolve(projectDir, './shared'),
    }],
  },
  plugins: [
    stylelint(),
    {
      apply: 'build',
      ...eslint(),
    },
    {
      apply: 'serve',
      ...eslint({
        failOnWarning: false,
        failOnError: false,
      }),
      enforce: 'post',
    },
  ],
});