const express = require('express');
const path = require('path');
const router = express.Router();

const isPassenger = typeof(PhusionPassenger) !== 'undefined';

if (!isPassenger) {

  const options = {
    setHeaders: function(res, path, stat) {
      res.set('Service-Worker-Allowed', '/');
    }
  }

  router.use('/dist', express.static(path.join(__dirname, '../dist'),
    options));

} else {
  router.use('/dist', express.static(path.join(__dirname, '../dist')));
}

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/login/login.html'))
});

router.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, '../dist/login/login.html'))
);

router.get("/palette", (req, res) =>
  res.sendFile(path.join(__dirname, '../dist/PaletteSelection/palette.html'))
);

router.get("/game", (req, res) =>
  res.sendFile(path.join(__dirname, '../dist/game/game.html'))
);

// Route to gallery
router.get("/gallery", (req, res) =>
  res.sendFile(path.join(__dirname, '../dist/gallery/gallery.html'))
);

router.get("/gallery/mnio1", (req, res) =>
  res.sendFile(path.join(__dirname, '../dist/gallery/gallery.html'))
);
router.get("/gallery/mnio2", (req, res) =>
  res.sendFile(path.join(__dirname, '../dist/gallery/gallery.html'))
);
router.get("/gallery/mnio3", (req, res) =>
  res.sendFile(path.join(__dirname, '../dist/gallery/gallery.html'))
);
router.get("/jouer", (req, res) =>
  res.sendFile(path.join(__dirname, '../dist/index.html')));

// const data = require(path.resolve(__dirname, '../app/gallery/games/game.min.1.json'));
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({
  extended: true
}));

const data = [
  require(path.resolve(__dirname, '../app/gallery/games/game1.json')),
  require(path.resolve(__dirname, '../app/gallery/games/game2.json')),
  require(path.resolve(__dirname, '../app/gallery/games/game3.json'))
];

router.put('/game', (req, res) => {
  console.log(req.body);
  res.send(data[parseInt(req.body.id) - 1]);
});

module.exports = router;
