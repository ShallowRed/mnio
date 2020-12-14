const Config = require('./webpack.commons.js');

const galleryConfig = Config({
  jsEntry: "./src/gallery/index.js",
  ejsEntry: "./src/gallery/index.ejs",
  name: "gallery",
  outputPath: "dist/gallery",
  outputName: "gallery.html"
});

module.exports = galleryConfig;
