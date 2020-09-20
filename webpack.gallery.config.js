const Config = require('./webpack.global.js');

const galleryConfig = Config({
  name: "gallery",
  outputPath: "dist/gallery",
  htmlOutputFileName: "gallery.html"
});

module.exports = galleryConfig;
