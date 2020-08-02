const Conf = require('./config');

const indextocoord = index => [
  (index - (index % Conf.rows)) / Conf.cols,
  index % Conf.rows
];

const coordtoindex = coord =>
  Conf.rows * coord[0] + coord[1];

module.exports = {
  indextocoord,
  coordtoindex
}
