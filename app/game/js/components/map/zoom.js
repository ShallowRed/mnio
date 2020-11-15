const focusZoom = (btn, bool) => {
  btn.style.color = btn.style.borderColor = bool ? "blue" : "black";
  btn.style.transform = bool ? "scale(1)" : "scale(0.8)";
}

const zoom = (dir, GAME) => {
  const { flag, UI, MAP } = GAME;

  if (!flag.ok()) return;

  focusZoom(UI.zoom[dir], true, flag.zoom);

  setTimeout(() =>
    focusZoom(UI.zoom[dir], false, flag.zoom), 100);

  if (dir == "in") {
    MAP.rows -= 2;
    MAP.cols -= 2;
  } else {
    MAP.rows += 2;
    MAP.cols += 2;
  }
  GAME.renderAll();
}

export default zoom;
