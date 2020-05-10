const CELL = {

  fill: (position, color, APP) => {
    let coordx = (position - (position % APP.rows)) / APP.cols;
    let coordy = (position % APP.cols);
    APP.ctx.fillStyle = "#" + color;
    APP.ctx.fillRect(APP.CellSize * coordy, APP.CellSize * coordx, APP.CellSize, APP.CellSize)
  },

  clear: (position, APP) => {
    let coordx = (position - (position % APP.rows)) / APP.cols;
    let coordy = (position % APP.cols);
    APP.ctx.clearRect(APP.CellSize * coordy, APP.CellSize * coordx, APP.CellSize, APP.CellSize);
  }

}

export default CELL
