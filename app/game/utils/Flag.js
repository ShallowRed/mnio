export default class Flag {
  constructor() {
    this.fill = false;
    this.translate = false;
    this.touch = false;
    this.zoom = false;
    this.fillCallback = true;
    this.moveCallback = true;
    this.tuto = false;
  }

  ok() {
    return !this.translate &&
      !this.fill &&
      !this.touch &&
      !this.zoom &&
      !this.tuto
  }
}
