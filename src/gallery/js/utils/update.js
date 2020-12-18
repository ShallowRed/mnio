// todo fix playbar sizing

const update = APP => {

  APP.CellSize = 4;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dvOn = APP.isOn.dataviz();

  const length1 = Math.min(Math.round(h * 0.7), Math.round(w * 0.4));
  const length2 = Math.min(Math.round(h * 0.8), Math.round(w * 0.5));
  const length3 = Math.round(w * 0.9);

  const length = {
    src: APP.CellSize * APP.rows,
    target: dvOn ? length1 : APP.isMobile ? length3 : length2,
    ratio: () => length.target / length.src
  }

  setCanvasSize(APP, dvOn, length, w);
  setDescSize(APP, dvOn);
  if (APP.donut && APP.bars && APP.yAxis1 && APP.yAxis2) setDvSize(APP);
};

const setCanvasSize = (APP, dvOn, length, w) => {
  APP.canvas.width = APP.canvas2.width = APP.canvas.height = APP.canvas2.height = length.src;
  APP.master.style.minWidth = APP.master.style.height = length.src + "px";
  APP.master.style.top = dvOn ? "45%" : "50%";
  APP.master.style.left = dvOn ? "7%" : APP.isMobile ? "50%" : (w < 1700) ? "52%" : "47%";
  APP.master.style.transformOrigin = dvOn ? "left" : "center";
  const cvShift = dvOn ? "0" : APP.isMobile ? "-50%" : "-30%";
  APP.master.style.transform = "translate(" + cvShift + ", -52%) scale(" + length.ratio() + ")";
}

const setDescSize = (APP, dvOn) => {
  APP.descbox.style.top = dvOn || APP.isMobile ? "100%" : "50%";
  const descShift = dvOn ? "-150%" : APP.isMobile ? "-125%" : "-50%";
  APP.descbox.style.transform = "translateY(" + descShift + ")";
}

const setDvSize = APP => {

  const offset = {
    width: APP.graphs.offsetWidth,
    height: APP.graphs.offsetHeight
  }

  const donutTargetSize = Math.min(offset.width, offset.height * 1.3);
  const donutScale =  donutTargetSize / 250;
  const donutTranslate = (offset.width - donutTargetSize) / (2 * donutScale);
  APP.donut.style.transform =
    "scale(" + donutScale + ") translateX(" + donutTranslate + "px)";

  const ratioW = offset.width / 250;
  const ratioH = offset.height / 250;

  APP.bars.style.transform =
    "scale(" + ratioW + "," + ratioH + ")";
  APP.ylabel.style.transform =
    "rotate(-90deg) scale(0.6," + 0.9 / ratioW + ") translateY(12px)";
  APP.yAxis1.style.transform =
    "scaleX(" + 1.5 / ratioW + ")";
  APP.dot1.style.transform =
    "scaleX(" + 1.5 / ratioW + ")";
  APP.yAxis2.style.transform =
    "scaleX(" + 1.5 / ratioW + ") translateX(3px)";
  APP.dot2.style.transform =
    "scaleX(" + 1.5 / ratioW + ") translateX(4px)";
}

export default update;
