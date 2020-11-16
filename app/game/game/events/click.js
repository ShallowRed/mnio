export default (GAME) => {
    const { flag, UI } = GAME;
    const { tuto } = UI;

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

    UI.colorBtns.forEach((colorBtn, i) => {

      colorBtn.style.background = GAME.PLAYER.palette[i];

      colorBtn.addEventListener("click", () => {
        if (!flag.ok()) return;
        GAME.selectColor(i);
        GAME.fill();
      });

      colorBtn.addEventListener("touchstart", (event) => {
        event.preventDefault();
        if (!flag.ok()) return;
        GAME.selectColor(i);
        GAME.fill();
      });
    });

    for (const [direction, btn] of Object.entries(UI.zoom)) {
      btn.addEventListener("click", () => {
        GAME.zoom(direction)
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
