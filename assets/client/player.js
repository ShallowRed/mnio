const PLAYER = {

  init: function(data) {
    this.position = data.position;
    this.colors = data.colors;
    this.selectedcolor = data.colors[0];
    this.canvas = document.getElementById('playercanvas');
    this.shadow = document.getElementById('shadow');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
  },

  update: function(animated, GAME, MAP) {

    // Get player's absolute position
    let position = require('./cell').indextocoord(PLAYER.position, GAME);
    PLAYER.x = position[0];
    PLAYER.y = position[1];

    // Calculate player X position in view
    if (PLAYER.x < MAP.hcols) {
      PLAYER.coefx = 0;
      PLAYER.vx = PLAYER.x;
    } else if (PLAYER.x > GAME.cols - MAP.hcols) {
      PLAYER.coefx = 2;
      PLAYER.vx = PLAYER.x + MAP.cols - GAME.cols - 2;
    } else {
      PLAYER.coefx = 1;
      PLAYER.vx = MAP.hcols - 1;
    }

    // Calculate player Y position in view
    if (PLAYER.y < MAP.hrows) {
      PLAYER.coefy = 0;
      PLAYER.vy = PLAYER.y;
    } else if (PLAYER.y > GAME.rows - MAP.hrows) {
      PLAYER.coefy = 2;
      PLAYER.vy = PLAYER.y + MAP.rows - GAME.rows - 2;
    } else {
      PLAYER.coefy = 1;
      PLAYER.vy = MAP.hrows - 1;
    }

    // Set player position in view, eventually with animation
    if (!animated) PLAYER.shadow.style.transitionDuration = PLAYER.canvas.style.transitionDuration = '0s';
    else PLAYER.shadow.style.transitionDuration = PLAYER.canvas.style.transitionDuration = GAME.duration + 's';
    PLAYER.shadow.style.top = PLAYER.canvas.style.top = PLAYER.vx * MAP.CellSize + MAP.shift + 'px';
    PLAYER.shadow.style.left = PLAYER.canvas.style.left = PLAYER.vy * MAP.CellSize + MAP.shift + 'px';

    // Eventually set player size
    if (animated) return;
    PLAYER.canvas.width = PLAYER.canvas.height = MAP.CellSize - MAP.shift * 4;
    PLAYER.shadow.style.width = PLAYER.shadow.style.height = MAP.CellSize - MAP.shift * 2 - 2 + 'px';
    PLAYER.shadow.style.borderRadius = PLAYER.canvas.style.borderWidth = PLAYER.canvas.style.borderRadius = MAP.shift + 'px';
  },

};

module.exports = PLAYER
