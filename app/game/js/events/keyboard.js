let isAltPressed = false;

export default (GAME) => {
  document.addEventListener('keydown', event => {

    if (event.code == "AltLeft")
      isAltPressed = true;

    if (
      GAME.flag.translate ||
      !GAME.flag.moveCallback ||
      GAME.flag.input
    ) return;

    onKeyDown(event, GAME)
  });

  document.addEventListener('keyup', event => {
    if (event.code == "AltLeft")
      isAltPressed = false;
    GAME.flag.input = false;
  });
};

const onKeyDown = (event, GAME) => {

  switch (event.code) {

    case "Space":
      GAME.fill();
      break;

    case "KeyW":
      GAME.zoom(isAltPressed ? "out" : "in");
      break;

    case "ControlLeft":
      GAME.selectColor("next");
      break;

    case "ShiftLeft":
      GAME.selectColor("prev");
      break;

    case "ArrowLeft":
      GAME.moveAttempt("left");
      break;

    case "ArrowUp":
      GAME.moveAttempt("up");
      break;

    case "ArrowRight":
      GAME.moveAttempt("right");
      break;

    case "ArrowDown":
      GAME.moveAttempt("down");
      break;
  }
};
