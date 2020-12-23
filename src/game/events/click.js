export default function listenClickEvents(Game) {
  const { flag, Ui } = Game;

  Ui.colorBtns.forEach((colorBtn, i) => {
    colorBtn.style.background = Game.Player.palette[i];

    colorBtn.addEventListener("mousedown", () => {
      Game.selectColor(i);
    });

    colorBtn.addEventListener("mouseup", () => {
      if (flag.isTranslating || flag.isZooming) return;
      Game.fill();
    });

    colorBtn.addEventListener("touchstart", (event) => {
      event.preventDefault();
      Game.selectColor(i);
    });

    colorBtn.addEventListener("touchend", (event) => {
      event.preventDefault();
      if (flag.isTranslating || flag.isZooming) return;
      Game.fill();
    });
  });

  for (const [direction, btn] of Object.entries(Ui.zoomBtns)) {
    btn.addEventListener("click", () => {
      Game.zoom(direction);
    });
  }

  document.addEventListener('click', () => {
    if (document.activeElement.toString() ==
      '[object HTMLButtonElement]')
      document.activeElement.blur();
  });
}
