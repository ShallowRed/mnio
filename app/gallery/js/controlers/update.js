const update = (APP) => {

  let w = window.innerWidth;
  let h = window.innerHeight;
  let length = (w < h) ?
    APP.dvflag ? Math.round(h * 0.5) : Math.round(w * 0.9) :
    APP.dvflag ? Math.round(w * 0.4) : Math.round(h * 0.8);
  APP.CellSize = Math.round(length / APP.rows);
  length = APP.CellSize * APP.rows;

  APP.canvas.width = APP.canvas2.width =
  APP.canvas.height =  APP.canvas2.height = length;

  APP.canvas.style.marginTop = APP.canvas2.style.marginTop = (APP.dvflag && w < h) ? "60px" : (h - length) / 2 + "px";

  APP.canvas.style.marginLeft =   APP.canvas2.style.marginLeft = APP.buttons.window.style.marginLeft = (APP.dvflag && w > h) ? "60px" : (w - length) / 2 + "px";

  APP.dataviz.style.marginTop = (APP.dvflag && w < h) ?length + 100 + "px" : (h - length) / 2 + "px";

  APP.dataviz.style.marginLeft = (APP.dvflag && w > h) ? length + 100 + "px" : (w - length) / 2 + "px";

  APP.dataviz.style.transform = "scale(" + length / 1000 + ")";

  APP.buttons.window.style.width = length + "px";

  let btnMargin = APP.canvas.style.marginTop.split("px")[0] - 60;
  APP.buttons.window.style.top = (btnMargin <= 5) ? 5 : btnMargin + "px";


};

export default update;
