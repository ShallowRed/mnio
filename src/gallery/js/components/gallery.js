import update from '../utils/update';
import TL from './timelapse';
import DV from './dataviz';

const APP = {
  canvas: document.getElementById('canvas'),
  canvas2: document.getElementById('canvas2'),
  master: document.getElementById('master'),
  description: document.getElementById("description"),
  descbox: document.getElementById("descbox"),
  gallery: document.getElementById("gallery"),
  gameList: document.getElementById("gameList"),
  list: document.getElementById('list'),
  playBar: document.getElementById("playBar"),
  graphs: document.getElementById("graphs"),
  globalSwitches: document.getElementById("globalSwitches"),
  dataviz: document.getElementById("dataviz"),
  sortHue: document.getElementById("sortHue"),
  menu: document.getElementById('menu'),
  galleryMenu: document.getElementById('galleryMenu'),
  switch: {
    timelapse: document.getElementById("switchTL"),
    dataviz: document.getElementById("switchDV")
  },
  isOn: {
    timelapse: () => APP.switch.timelapse.checked,
    dataviz: () => APP.switch.dataviz.checked
  },
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
};

APP.init = Game => {
  APP.gameList.style.display = "none";
  APP.menu.style.display = "flex";
  APP.gallery.style.display = "flex";

  APP.galleryMenu.addEventListener("click", () =>
    window.location.reload());

  APP.ctx = APP.canvas.getContext('2d');
  APP.ctx2 = APP.canvas2.getContext('2d');
  APP.ctx.imageSmoothingEnabled = false;
  APP.ctx2.imageSmoothingEnabled = false;

  Object.keys(Game).forEach(p => APP[p] = Game[p]);

  Object.keys(toggle).forEach(prop => {
    const switchBtn = APP.switch[prop];
    switchBtn.addEventListener("click", () => toggle[prop](APP))
  });

  update(APP)
  TL.init(APP);
  if (!APP.isMobile) {
    DV.init(APP, Game);
    mode.dataviz.off();
    mode.timelapse.off();
  } else {
    APP.globalSwitches.style.display = "none";
    APP.dataviz.style.display = "none";
    mode.timelapse.on();
  }
  setInfo(APP);
  setInsights(APP);
};

APP.renderAll = () => TL.actions.end(APP);

APP.update = () => {
  update(APP);
  if (APP.isOn.timelapse())
    TL.actions.resize(APP);
  else
    APP.renderAll();
};

const toggle = {

  timelapse: () => {
    if (!APP.isOn.timelapse())
      mode.timelapse.off();
    else mode.timelapse.on();

    if (APP.isOn.dataviz())
      mode.dataviz.off();
    APP.update();
  },

  dataviz: () => {
    if (!APP.isOn.dataviz())
      mode.dataviz.off();
    else mode.dataviz.on();
    if (APP.isOn.timelapse())
      mode.timelapse.off();
    APP.update();
    APP.renderAll();
  }
};

const mode = {

  timelapse: {
    on: () => {
      APP.playBar.style.display = "flex";
      TL.actions.clearMap(APP);
      setTimeout(() =>
        TL.actions.play("slow", APP), 500
      );
    },
    off: () => {
      APP.switch.timelapse.checked = false;
      APP.playBar.style.display = "none";
      TL.actions.stop(APP);
      APP.renderAll();
    }
  },

  dataviz: {
    on: () => {
      if (!isCartonLoaded) {
        loadCartonImages();
      }
      APP.dataviz.style.display = "block";
    },
    off: () => {
      APP.switch.dataviz.checked = false;
      APP.dataviz.style.display = "none";
    }
  }
};

const tlImages = [
  "reset", "slow", "fast", "pause", "end"
];

const cartonImages = {
  dgScale: "cote",
  dg: "gaulle",
  woolImg: "fil",
  delay: "delay"
};

let isCartonLoaded = false;

const loadCartonImages = () => {
  Object.entries(cartonImages).forEach(([id, name]) =>
    document.getElementById(id).src = `/dist/gallery/img/${name}.png`
  );
  isCartonLoaded = true;
}

const setInsights = (APP) => {

  const tapX = document.getElementById('tapX');
  const tapY = document.getElementById('tapY');
  const gaulleRatio = document.getElementById('gaulleRatio');
  const tapFil = document.getElementById('tapFil');
  const tapDelay = document.getElementById('tapDelay');
  const dgScale = document.getElementById('dgScale');
  const dg = document.getElementById('dg')

  const dgRatio = 0.01 * Math.round(APP.rows / 1.96);

  tapX.innerHTML = APP.rows / 100;
  tapY.innerHTML = APP.cols / 100 + "&nbsp;m";
  gaulleRatio.innerHTML = dgRatio + " Général de Gaulle";
  tapFil.innerHTML = APP.rows * APP.cols * 0.4 + "m";
  tapDelay.innerHTML = APP.rows * APP.cols * 0.08 + "h";

  if (dgRatio > 1) {
    dg.style.transform = "scale(" + 1 / dgRatio + ")";
    dgScale.style.transform = "translate(-17px)";
  } else dgScale.style.transform = "scale(" + dgRatio + ") translate(-17px)";

};

const setInfo = APP => {

  const dateRange = document.getElementById('date');
  const nOfPlayers = document.getElementById('players');
  const dim = document.getElementById('dim');
  const mnioName = document.getElementById('mnioName');

  const totalPlayers = APP.poorPlayers + APP.players.length;
  mnioName.innerHTML = "mnio.00" + APP.id;
  dateRange.innerHTML = APP.dates;
  nOfPlayers.innerHTML = totalPlayers + " joueurs";
  dim.innerHTML = APP.rows + " x " + APP.cols + " px";
};


export default APP;
