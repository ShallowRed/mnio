const Config = require('./webpack.commons.js');

const galleryConfig = Config({
  jsEntry: "./app/gallery/index.js",
  ejsEntry: "./app/gallery/index.ejs",
  name: "gallery",
  outputPath: "dist/gallery",
  outputName: "gallery.html"
});

module.exports = galleryConfig;
