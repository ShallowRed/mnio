const express = require('express');
const path = require('path');
const router = express.Router();

const options = {
  setHeaders: function(res, path, stat) {
    res.set('Service-Worker-Allowed', '/');
  }
}

router.use('/dist', express.static(path.join(process.cwd(), './dist'), options));

// Route to game
router.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, '../dist/index.html'))
);

// Route to gallery
router.get("/gallery", (req, res) =>
  res.sendFile(path.join(__dirname, '../dist/gallery/gallery.html'))
);

module.exports = router;
