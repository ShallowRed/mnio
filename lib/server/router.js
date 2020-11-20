const express = require('express');
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({
  extended: true
}));

const isPassenger = typeof(PhusionPassenger) !== 'undefined';

const options = isPassenger ? {} : {
  setHeaders: function(res, path, stat) {
    res.set('Service-Worker-Allowed', '/');
  }
};

const Dist = path.join(__dirname, '../../dist');

router.use('/dist', express.static(Dist, options));

router.get("/", (req, res) => {
  res.sendFile(Dist + '/login/login.html')
});

router.get("/palette", (req, res) =>
  res.sendFile(Dist + '/PaletteSelection/palette.html')
);

router.get("/game", (req, res) =>
  res.sendFile(Dist + '/game/game.html')
);

router.get("/gallery", (req, res) =>
  res.sendFile(Dist + '/gallery/gallery.html')
);

router.get("/gallery/mnio1", (req, res) =>
  res.sendFile(Dist + '/gallery/gallery.html')
);

router.get("/gallery/mnio2", (req, res) =>
  res.sendFile(Dist + '/gallery/gallery.html')
);

router.get("/gallery/mnio3", (req, res) =>
  res.sendFile(Dist + '/gallery/gallery.html')
);

const data = [
  require(path.resolve(__dirname, '../../datadev/games/game1.json')),
  require(path.resolve(__dirname, '../../datadev/games/game2.json')),
  require(path.resolve(__dirname, '../../datadev/games/game3.json'))
];

router.put('/game', (req, res) => {
  const gameId = parseInt(req.body.id) - 1;
  res.send(data[gameId]);
});

module.exports = router;
