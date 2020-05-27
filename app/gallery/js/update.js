const update = (APP) => {

  APP.CellSize = 4;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dvOn = APP.isOn.dataviz();
  const phoneW = (w < 330) ? 0.4 : (w < 360) ? 0.5 : (w < 400) ? 0.6 : 0.7;

  const length1 = Math.min(Math.round(h * 0.7), Math.round(w * 0.4));
  const length2 = Math.min(Math.round(h * 0.8), Math.round(w * 0.5));
  const length3 = Math.round(w * phoneW);

  const length = {
    src: APP.CellSize * APP.rows,
    target: dvOn ? length1 : APP.isMobile ? length3 : length2,
    ratio: () => length.target / length.src
  }

  APP.canvas.width = APP.canvas2.width = APP.canvas.height = APP.canvas2.height = length.src;

  APP.master.style.minWidth = APP.master.style.height = length.src + "px";
  APP.master.style.top = dvOn ? "45%" : "50%";
  APP.master.style.left = dvOn ? "7%" : APP.isMobile ? "50%" : (w < 1700) ? "52%" : "47%";
  APP.master.style.transformOrigin = dvOn ? "left" : "center";
  const cvShift = dvOn ? "0" : APP.isMobile ? "-50%" : "-30%";
  APP.master.style.transform = "translate(" + cvShift + ", -52%) scale(" + length.ratio() + ")";

  APP.descbox.style.top = dvOn || APP.isMobile ? "100%" : "50%";
  const dbSchift = dvOn ? "-150%" : APP.isMobile ? "-125%" : "-50%";
  APP.descbox.style.transform = "translateY(" + dbSchift + ")";

  if (!APP.donut || !APP.bars || !APP.yAxis1 || !APP.yAxis2 ) return;

  const offset = {
    width: APP.graphs.offsetWidth,
    height: APP.graphs.offsetHeight
  }

  const donutTarget = Math.min(offset.width, offset.height * 1.3);
  const delta = offset.width - donutTarget;

  const ratio = {
    donut: donutTarget / 250,
    bars: {
      width: offset.width / 250,
      height: offset.height / 250
    }
  }

  APP.donut.style.transform =
    "scale(" + ratio.donut + ") translateX(" + delta / (2 * ratio.donut) + "px)";
  APP.bars.style.transform = "scale(" + ratio.bars.width + "," + ratio.bars.height + ")";
  APP.ylabel.style.transform = "rotate(-90deg) scale(0.6," + 0.9 / ratio.bars.width + ") translateY(12px)";
  APP.yAxis1.style.transform = "scaleX(" + 1.5 / ratio.bars.width + ")";
  APP.dot1.style.transform = "scaleX(" + 1.5 / ratio.bars.width + ")";
  APP.yAxis2.style.transform = "scaleX(" + 1.5 / ratio.bars.width + ") translateX(3px)";
  APP.dot2.style.transform = "scaleX(" + 1.5 / ratio.bars.width + ") translateX(4px)";

};



export default update;
