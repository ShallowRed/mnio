module.exports = {

  indextocoord: function(index, { rows, cols }) {
    return [
      (index - (index % rows)) / cols,
      index % rows
    ];
  },

  coordtoindex: function([x, y], { rows }) {
    return rows * x + y;
  }

}
