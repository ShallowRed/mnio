const Events = {
  init: APP => {
    Object.keys(Events.click).forEach(prop => {
      const evtBtn = APP.buttons[prop];
      evtBtn.addEventListener("click", () => Events.click[prop](APP))
    });
    window.addEventListener('resize', () => APP.render.resize(APP), true);
    window.addEventListener("orientationchange", () =>
      setTimeout(() => APP.render.resize(APP), 500)
    );
    toggleTL(APP);
  }
};

Events.click = {

  slow: APP => APP.render.play(APP, "slow"),

  fast: APP => APP.render.play(APP, "fast"),

  faster: APP => APP.render.play(APP, "faster"),

  pause: APP => {
    APP.play = false;
    APP.render.focusBtn(APP, "pause");
  },

  end: APP => {
    APP.render.stop(APP);
    APP.render.all(APP);
  },

  reset: APP => {
    APP.render.stop(APP);
  }
};

const toggleTL = (APP) => {
    APP.buttons.time.style.display = "flex";
    setTimeout(() => APP.buttons.time.style.opacity = "1", 10);
    APP.render.clearMap(APP);
}

export default Events
