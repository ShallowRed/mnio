const Config = require('./webpack.commons.js');

const paletteConfig = Config({
  jsEntry: "./app/PaletteSelection/PaletteSelection.js",
  ejsEntry: "./app/PaletteSelection/PaletteSelection.ejs",
  name: "palette",
  outputPath: "dist/PaletteSelection",
  outputName: "palette.html",
  inject: true
});

module.exports = paletteConfig;
