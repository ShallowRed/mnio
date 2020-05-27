import update from './update';
import TL from './components/timelapse';
import DV from './components/dataviz';

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

APP.init = GAME => {
  APP.gameList.style.display = "none";
  APP.menu.style.display = "flex";
  APP.gallery.style.display = "flex";

  APP.galleryMenu.addEventListener("click", () =>
    window.location.reload());

  APP.ctx = APP.canvas.getContext('2d');
  APP.ctx2 = APP.canvas2.getContext('2d');
  APP.ctx.imageSmoothingEnabled = false;
  APP.ctx2.imageSmoothingEnabled = false;

  Object.keys(GAME).forEach(p => APP[p] = GAME[p]);

  Object.keys(toggle).forEach(prop => {
    const switchBtn = APP.switch[prop];
    switchBtn.addEventListener("click", () => toggle[prop](APP))
  });

  update(APP)
  TL.init(APP);
  if (!APP.isMobile) {
    DV.init(APP, GAME);
    mode.dataviz.off();
    mode.timelapse.off();
  } else {
    APP.globalSwitches.style.display = "none";
    APP.dataviz.style.display = "none";
    mode.timelapse.on();
  };
  setInfo(APP);
  setInsights(APP);
};

APP.renderAll = () => TL.actions.end(APP);

APP.update = () => {
  update(APP);
  if (APP.isOn.timelapse()) TL.actions.resize(APP);
  else APP.renderAll();
};

const toggle = {

  timelapse: () => {
    if (!APP.isOn.timelapse()) mode.timelapse.off();
    else mode.timelapse.on();
    if (APP.isOn.dataviz()) mode.dataviz.off();
    APP.update();
  },

  dataviz: () => {
    if (!APP.isOn.dataviz()) mode.dataviz.off();
    else mode.dataviz.on();
    if (APP.isOn.timelapse()) mode.timelapse.off();
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
        TL.actions.play("slow", APP), 500);
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
      APP.dataviz.style.display = "block";
    },
    off: () => {
      APP.switch.dataviz.checked = false;
      APP.dataviz.style.display = "none";
    }
  }
};

const remove = id => {
  const element = document.getElementById(id);
  console.log();
  element.parentNode.removeChild(element);
};

const insights = {
  tapX: document.getElementById('tapX'),
  tapY: document.getElementById('tapY'),
  gaulleRatio: document.getElementById('gaulleRatio'),
  tapFil: document.getElementById('tapFil'),
  tapDelay: document.getElementById('tapDelay'),
  dgScale: document.getElementById('dgScale'),
  dg: document.getElementById('dg')
};


const setInsights = (APP) => {
  const gaulleRatio = 0.01 * Math.round(APP.rows / 1.96);
  insights.tapX.innerHTML = APP.rows / 100;
  insights.tapY.innerHTML = APP.cols / 100 + "&nbsp;m";
  insights.gaulleRatio.innerHTML = gaulleRatio + " Général de Gaulle";
  insights.tapFil.innerHTML = APP.rows * APP.cols * 0.4 + "m";
  insights.tapDelay.innerHTML = APP.rows * APP.cols * 0.08 + "h";
  if (gaulleRatio > 1) {
    insights.dg.style.transform = "scale(" + 1 / gaulleRatio + ")"
    insights.dgScale.style.transform = "translate(-17px)"
  }
  else insights.dgScale.style.transform = "scale(" + gaulleRatio + ") translate(-17px)"

};

const info = {
  date: document.getElementById('date'),
  players: document.getElementById('players'),
  dim: document.getElementById('dim'),
  name: document.getElementById('mnioName'),
}

const setInfo = (APP) => {
  const totalPlayers = APP.poorPlayers + APP.players.length;
  info.name.innerHTML ="mnio.00" + APP.id;
  info.date.innerHTML = APP.dates;
  info.players.innerHTML = totalPlayers + " joueurs";
  info.dim.innerHTML = APP.rows + " x " + APP.cols +" px";
};


export default APP;
