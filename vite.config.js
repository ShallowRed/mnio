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

const input = {
  lobby: path.resolve(srcDir, 'scripts/lobby.js'),
  palette: path.resolve(srcDir, 'scripts/palette.js'),
  game: path.resolve(srcDir, 'scripts/game.js'),
};

export default defineConfig({
  root: srcDir,
  // server: {
  // origin: 'http://localhost:3000',
  // port: 3000,
  // },
  build: {
    ssrManifest: true,
    manifest: true,
    outDir,
    rollupOptions: {
      input,
      //     output: {
      //       assetFileNames: getAssetOutputFilename,
      //       chunkFileNames: 'scripts/[name]-[hash].js',
      //       entryFileNames: 'scripts/[name]-[hash].js',
      //     },
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