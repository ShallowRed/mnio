module.exports = {

  indextocoord: function(index) {
    return [
      (index - (index % this.rows)) / this.cols,
      index % this.rows
    ];
  },

  coordtoindex: function([x, y]) {
    return this.rows * x + y;
  }
  
}
