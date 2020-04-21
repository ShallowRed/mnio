  function posinview(position, PLAYER, GAME, MAP) {
    let cell = indextocoord(position, GAME);
    if (PLAYER.coefx == 2) cell[0] -= GAME.cols - MAP.cols;
    else if (PLAYER.coefx == 1) cell[0] -= PLAYER.x - MAP.hcols;
    if (PLAYER.coefy == 2) cell[1] -= GAME.rows - MAP.rows;
    else if (PLAYER.coefy == 1) cell[1] -= PLAYER.y - MAP.hrows;
    return [cell[0], cell[1]]
  };

  function check(position, PLAYER, GAME, MAP) {
    let cell = posinview(position, PLAYER, GAME, MAP);
    if (cell[0] >= 0 && cell[0] <= MAP.cols && cell[1] >= 0 && cell[1] <= MAP.rows) return [cell[0], cell[1]];
  };

  function indextocoord(index, GAME) {
    let coordx = (index - (index % GAME.rows)) / GAME.cols;
    let coordy = (index % GAME.cols);
    return [coordx, coordy];
  };

  function clear(position, ctx, PLAYER, GAME, MAP) {
    let cell = check(position, PLAYER, GAME, MAP);
    if (cell) ctx.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
  };

  const render = {

    color: function(position, color, PLAYER, GAME, MAP) {
      let cell = check(position, PLAYER, GAME, MAP);
      if (!cell) return;
      MAP.ctx2.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
      MAP.ctx2.fillStyle = color;
      MAP.ctx2.fillRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
    },

    allowed: function(position, PLAYER, GAME, MAP) {
      let cell = check(position, PLAYER, GAME, MAP);
      if (!cell) return;
      MAP.ctx1.clearRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
      MAP.ctx1.fillStyle = '#e9e9e9';
      MAP.ctx1.fillRect(MAP.CellSize * cell[1], MAP.CellSize * cell[0], MAP.CellSize, MAP.CellSize);
    },

    position: function(position, PLAYER, GAME, MAP) {
      let cell = check(position, PLAYER, GAME, MAP);
      if (cell) this.roundRect(MAP.ctx3, MAP.CellSize * cell[1] + MAP.shift * 1.5, MAP.CellSize * cell[0] + MAP.shift * 1.5, MAP.CellSize - MAP.shift * 3, MAP.CellSize - MAP.shift * 3, MAP.shift, MAP);
    },

    roundRect: function(ctx, x, y, width, height, radius, MAP) {
      ctx.strokeStyle = "black";
      ctx.lineWidth = MAP.shift;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.stroke();
    },

  }

  module.exports = {
    posinview,
    check,
    indextocoord,
    clear,
    render
  }
