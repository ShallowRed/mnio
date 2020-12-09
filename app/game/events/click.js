export default (Game) => {
    const { flag, Ui } = Game;
    const { tuto } = Ui;

    tuto.openBtn.addEventListener("click", () => {
      show(tuto.window);
      tuto.openBtn.style.display = "none";
      tuto.closeBtn.style.display = "block";
      flag.tuto = true;
    });

    tuto.closeBtn.addEventListener("click", () => {
      hide(tuto.window);
      tuto.openBtn.style.display = "block";
      tuto.closeBtn.style.display = "none";
      flag.tuto = false;
    });

    Ui.colorBtns.forEach((colorBtn, i) => {

      colorBtn.style.background = Game.Player.palette[i];

      colorBtn.addEventListener("click", () => {
        if (flag.isTranslating || flag.isZooming) return;
        Game.selectColor(i);
        Game.fill();
      });

      colorBtn.addEventListener("touchstart", (event) => {
        event.preventDefault();
        if (flag.isTranslating || flag.isZooming) return;
        Game.selectColor(i);
        Game.fill();
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

const hide = (elem) => {
  elem.style.opacity = "0";
  setTimeout(() => elem.style.display = "none", 300);
};

const show = (elem) => {
  elem.style.display = "block";
  setTimeout(() => elem.style.opacity = "1", 50);
};
