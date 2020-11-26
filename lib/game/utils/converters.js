module.exports = {

  indextocoord(index, { rows, cols }) {
    const x = index % cols;
    const y = (index - x) / rows;
    return [x,y];
  },

  coordtoindex([x, y], { cols }) {
    return cols * y + x;
  }

}
