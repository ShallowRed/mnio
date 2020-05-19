const update = (APP) => {

  let w = window.innerWidth;
  let h = window.innerHeight;

  let length = (w < h) ? w * 0.9 : h * 0.8;

  APP.CellSize = Math.round(length / APP.rows);

  length = APP.CellSize * APP.rows;

  APP.canvas.width = APP.canvas.height = length;
  APP.canvas.style.marginTop = (h - length) / 2 + "px";
  APP.canvas.style.marginLeft = APP.buttons.window.style.marginLeft = (w - length) / 2 + "px";

  let btnMargin = APP.canvas.style.marginTop.split("px")[0] - 60;
  APP.buttons.window.style.width = length + "px";
  APP.buttons.window.style.top = (btnMargin <= 5) ? 5 : btnMargin + "px";
};

export default update;
