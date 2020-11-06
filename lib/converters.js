const { rows, cols } = require('./config');

const indextocoord = index => [
  (index - (index % rows)) / cols,
  index % rows
];

const coordtoindex = ([x, y]) =>
  rows * x + y;

module.exports = {
  indextocoord,
  coordtoindex
}
