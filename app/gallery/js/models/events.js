import drawDonut from '../dataviz/colors'
import drawBars from '../dataviz/players'

let donutflag = false;

const Events = {};

Events.init = APP => {
  Object.keys(Events.click).forEach(prop => {
    let evtBtn = APP.buttons[prop];
    evtBtn.addEventListener("click", () => Events.click[prop](APP))
  });
  Events.window(APP);
};

Events.click = {

  slow: APP => APP.render.play("slow"),

  fast: APP => APP.render.play("fast"),

  faster: APP => APP.render.play("faster"),

  pause: APP => {
    APP.play = false;
    APP.render.focusBtn("pause");
  },

  end: APP => {
    APP.render.stop();
    APP.render.all();
    setTimeout(() => {
      APP.time = APP.colors.length;
    }, 50)
  },

  reset: APP => {
    APP.render.stop();
    APP.time = 0;
  },

  hue: () => {
    if (!donutflag) donutflag = true;
    else donutflag = false;
    drawDonut(donutflag)
  },

  bars: () => {
    document.querySelector("svg").style.display = "none";
    drawBars();

  },

  stats: (APP) => toggleStats(APP)
};

Events.window = APP => {
  window.addEventListener('resize', () => APP.render.resize(), true);
  window.addEventListener("orientationchange", () =>
    setTimeout(() => APP.render.resize(), 500)
  );
};

const toggleStats = (APP) => {
  if (APP.dataviz.style.display == "block") {
    APP.dataviz.style.display = "none"
    APP.canvas.style.display = "block"
    APP.dvflag = false;
  } else {
    APP.dataviz.style.display = "block";
    APP.dvflag = true;
    // APP.canvas.style.display = "none"
  }
  APP.update(APP);
}

export default Events
