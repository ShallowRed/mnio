const Config = require('./webpack.global.js');

const galleryConfig = Config({
  jsEntry: "gallery/index.js",
  ejsEntry: "gallery/index.ejs",
  outputPath: "dist/gallery",
  htmlOutputFileName: "gallery.html"
});

module.exports = galleryConfig;
