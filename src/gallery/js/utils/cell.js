const CELL = {

  fill: (position, color, APP, ctxx) => {
    let ctx = (ctxx) ? ctxx : APP.ctx;
    let coordx = (position - (position % APP.rows)) / APP.cols;
    let coordy = (position % APP.cols);
    ctx.fillStyle = "#" + color;
    ctx.fillRect(APP.CellSize * coordy, APP.CellSize * coordx, APP.CellSize, APP.CellSize)
  },

  clear: (position, APP, ctx) => {
    let coordx = (position - (position % APP.rows)) / APP.cols;
    let coordy = (position % APP.cols);
    ctx.clearRect(APP.CellSize * coordy, APP.CellSize * coordx, APP.CellSize, APP.CellSize);
  }

}

export default CELL
