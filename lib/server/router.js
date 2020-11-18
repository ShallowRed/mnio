const express = require('express');
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');

const isPassenger = typeof(PhusionPassenger) !== 'undefined';

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({
  extended: true
}));

const options = isPassenger ? {} : {
  setHeaders: function(res, path, stat) {
    res.set('Service-Worker-Allowed', '/');
  }
};

router.use('/dist', express.static(path.join(__dirname, '../dist'),
  options));

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/login/login.html'))
});

router.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, '../dist/login/login.html'))
);

router.get("/palette", (req, res) =>
  res.sendFile(path.join(__dirname,
    '../dist/PaletteSelection/palette.html'))
);

router.get("/game", (req, res) =>
  res.sendFile(path.join(__dirname, '../dist/game/game.html'))
);

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


const data = [
  require(path.resolve(__dirname, '../datadev/games/game1.json')),
  require(path.resolve(__dirname, '../datadev/games/game2.json')),
  require(path.resolve(__dirname, '../datadev/games/game3.json'))
];

router.put('/game', (req, res) => {
  const gameId = parseInt(req.body.id) - 1;
  res.send(data[gameId]);
});

module.exports = router;
