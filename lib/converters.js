const Conf = require('../config/mnio.config');

const indextocoord = i => [
  (i - (i % Conf.rows)) / Conf.cols,
  i % Conf.rows
];

const coordtoindex = coord => Conf.rows * coord[0] + coord[1];

module.exports = {
  indextocoord,
  coordtoindex
}
