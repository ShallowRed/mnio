let isAltPressed = false;

export default (Game) => {
  document.addEventListener('keydown', event => {

    if (event.code == "AltLeft")
      isAltPressed = true;

    if (
      Game.flag.isTranslating ||
      Game.flag.waitingServerConfirmMove
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
      document.querySelector(".pressed")
      focusBtn(".pressed");
      Game.fill();
      break;

    case "KeyW":
      focusBtn(Game.Ui.zoomBtns.in);
      Game.zoom("in");
      break;

    case "KeyS":
      if (isAltPressed) {
        focusBtn(Game.Ui.zoomBtns.out);
        Game.zoom("out");
      }
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

const focusBtn = (btn) => {
  if (typeof btn == "string")
    btn = document.querySelector(btn);
  btn.focus();
  setTimeout(() => {
    document.activeElement.blur();
  }, 200);
};
