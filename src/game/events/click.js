export default function listenClickEvents(Game) {
  const { flag, Ui } = Game;

  const fill = (i) => {
    if (flag.isTranslating || flag.isZooming) return;
    Game.fill();
  };

  const pressColorBtn = (i) => {
    Ui.colorBtns[i].style.transform = 'scale(0.8)';
    Ui.colorBtns[i].style.boxShadow = '#777 2px 2px 0px';
  }

  Ui.colorBtns.forEach((colorBtn, i) => {
    colorBtn.style.background = Game.Player.palette[i];

    colorBtn.addEventListener("mousedown", () => {
      Game.selectColor(i);
      pressColorBtn(i);
    });

    colorBtn.addEventListener("mouseup", () => {
      Ui.focusColorBtn(i);
      fill(i)
    });

    colorBtn.addEventListener("touchstart", (event) => {
      event.preventDefault();
      pressColorBtn(i);
      Game.selectColor(i);
    });

    colorBtn.addEventListener("touchend", (event) => {
      event.preventDefault();
      Ui.focusColorBtn(i);
      fill(i);
    });
  });

  for (const [direction, btn] of Object.entries(Ui.zoom)) {
    btn.addEventListener("click", () => {
      Game.zoom(direction)
    });
  }

  document.addEventListener('click', () => {
    if (document.activeElement.toString() ==
      '[object HTMLButtonElement]')
      document.activeElement.blur();
  });
};
