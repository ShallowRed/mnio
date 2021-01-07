module.exports = {

  indexToCoord(index, { rows, cols }) {
    const x = index % cols;
    const y = (index - x) / rows;
    return [x,y];
  },

  coordToIndex([x, y], { cols }) {
    return cols * y + x;
  }

}
