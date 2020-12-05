let isAltPressed = false;

export default (Game) => {
  document.addEventListener('keydown', event => {

    if (event.code == "AltLeft")
      isAltPressed = true;

    if (
      Game.flag.translate ||
      !Game.flag.moveCallback
    ) return;

    onKeyDown(event, Game)
  });

  document.addEventListener('keyup', event => {
    if (event.code == "AltLeft")
      isAltPressed = false;
  });
};

const onKeyDown = (event, Game) => {

  switch (event.code) {

    case "Space":
      Game.fill();
      break;

    case "KeyW":
      Game.zoom("in");
      break;

    case "KeyS":
      if (isAltPressed) Game.zoom("out");
      break;

    case "ControlLeft":
      Game.selectColor("next");
      break;

    case "ShiftLeft":
      Game.selectColor("prev");
      break;

    case "ArrowLeft":
      Game.moveAttempt("left");
      break;

    case "ArrowUp":
      Game.moveAttempt("up");
      break;

    case "ArrowRight":
      Game.moveAttempt("right");
      break;

    case "ArrowDown":
      Game.moveAttempt("down");
      break;
  }
};
