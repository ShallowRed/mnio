import {
  indextocoord
} from '../utils/utils'

const PLAYER = {};

PLAYER.init = ({ position, palette }) => {
  PLAYER.position = position;
  PLAYER.palette = palette;
  PLAYER.Scolor = palette[0];
  PLAYER.canvas = [document.getElementById('playercanvas'), document
    .getElementById('shadow')
  ];
  PLAYER.canvas[0].getContext('2d')
    .imageSmoothingEnabled = false;
};

PLAYER.update = function() {
  const { GAME, MAP } = this;
  console.log(this);
  PLAYER.coord = indextocoord(PLAYER.position, GAME);
  PLAYER.is = {
    up: PLAYER.coord[0] < MAP.half[0],
    down: PLAYER.coord[0] > GAME.cols - MAP.half[0],
    left: PLAYER.coord[1] < MAP.half[1],
    right: PLAYER.coord[1] > GAME.rows - MAP.half[1]
  }
};

PLAYER.render = function(animated) {
  const { GAME, MAP } = this;

  PLAYER.canvas.forEach(canvas => {
    canvas.style.transitionDuration = animated ? GAME.duration + 's' :
      '0s'

    canvas.style.top = (
      PLAYER.is.up ?
      PLAYER.coord[0] :
      PLAYER.is.down ?
      PLAYER.coord[0] + MAP.cols - GAME.cols - 2 :
      MAP.half[0] - 1
    ) * MAP.cellSize + MAP.shift + 'px';

    canvas.style.left = (
      PLAYER.is.left ? PLAYER.coord[1] :
      PLAYER.is.right ? PLAYER.coord[1] + MAP.rows - GAME.rows - 2 :
      MAP.half[1] - 1
    ) * MAP.cellSize + MAP.shift + 'px';
  });

  if (animated) return;
  PLAYER.canvas[0].width = PLAYER.canvas[0].height = MAP.cellSize - MAP
    .shift * 4;
  PLAYER.canvas[1].style.width = PLAYER.canvas[1].style.height = MAP
    .cellSize - MAP.shift * 2 - 2 + 'px';
  PLAYER.canvas.forEach(canvas =>
    canvas.style.borderRadius = MAP.shift + 'px'
  );
  PLAYER.canvas[0].style.borderWidth = MAP.shift + 'px';
}


export default PLAYER
