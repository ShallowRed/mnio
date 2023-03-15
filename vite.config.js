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

console.log("-----------------------------------------");
console.log("projectDir", projectDir);
console.log("srcDir", srcDir);
console.log("outDir", outDir);

const input = {
  lobby: path.resolve(srcDir, 'scripts/lobby.js'),
  palette: path.resolve(srcDir, 'scripts/palette.js'),
  game: path.resolve(srcDir, 'scripts/game.js'),
};

const alias = [
  {
    find: '@',
    replacement: srcDir,
  },
  {
    find: 'shared',
    replacement: path.resolve(projectDir, './shared'),
  },
  {
    find: 'styles',
    replacement: path.resolve(srcDir, 'styles'),
  },
  {
    find: 'game',
    replacement: path.resolve(srcDir, 'scripts/game'),
  }
];

/**
 * @see https://vitejs.dev/guide/backend-integration.html
 * @see https://github.com/szymmis/vite-express
 */
export default defineConfig({
  root: srcDir,
  // server: {
    // origin: 'http://localhost:3000',
    // port: 3000,
  // },
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
    alias,
  },
  plugins: [
    stylelint(),
    // {
    //   apply: 'build',
    //   ...eslint(),
    // },
    // {
    //   apply: 'serve',
    //   ...eslint({
    //     failOnWarning: false,
    //     failOnError: false,
    //   }),
      // enforce: 'post',
    // },
  ],
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
});

function getAssetOutputFilename({ name }) {
  let assetSubDir = '.';

  const assetsSubDirs = [
    {
      test: /.css$/,
      dir: 'styles',
    },
    {
      test: /\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i,
      dir: 'img',
    },
    {
      test: /.(eot|ttf|woff|woff2)(\??#?v=[.0-9]+)?$/,
      dir: 'fonts',
    },
  ];

  for (const { test, dir } of assetsSubDirs) {
    if (test.test(name)) {
      assetSubDir = dir;
      break;
    }
  }

  return `${assetSubDir}/[name]-[hash][extname]`;
}
