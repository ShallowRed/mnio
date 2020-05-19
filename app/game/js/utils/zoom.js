const focusZoom = (btn, bool) => {
  btn.style.color = btn.style.borderColor = bool ? "blue" : "black";
  btn.style.transform = bool ? "scale(1)" : "scale(0.8)";
}

const zoom = (dir, GAME, MAP, UI) => {
  if (!GAME.flag.ok()) return;
  focusZoom(UI.zoom[dir], true, GAME.flag.zoom);
  setTimeout(() => focusZoom(UI.zoom[dir], false, GAME.flag.zoom), 100)
  if (dir == "in") {
    MAP.RowCol[1] -= 2;
    MAP.RowCol[0] -= 2;
  } else {
    MAP.RowCol[1] += 2;
    MAP.RowCol[0] += 2;
  }
  GAME.render();
}

export default zoom;
