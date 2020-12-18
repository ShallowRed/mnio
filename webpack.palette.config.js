const Config = require('./webpack.commons.js');

const paletteConfig = Config({
  jsEntry: "./src/PaletteSelection/PaletteSelection.js",
  ejsEntry: "./src/PaletteSelection/PaletteSelection.ejs",
  name: "palette",
  outputPath: "dist/palette",
  outputName: "palette.html",
  inject: true
});

module.exports = paletteConfig;
