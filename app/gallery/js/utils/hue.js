const hexToHsl = require('hex-to-hsl');

const sortedByHue = (APP) => {

  APP.count = new Array(APP.palette.length).fill(0);
  APP.colors.forEach(e => APP.count[e]++);

  return APP.count
    .filter(e => e > 100)
    .map((e, i) => {
      return {
        color: "#" + APP.palette[i],
        hue: hexToHsl("#" + APP.palette[i])[0],
        amount: e
      }
    })
    .sort((a, b) => a.hue - b.hue)
    .map(e => {
      return {
        color: e.color,
        amount: e.amount
      }
    })
}

export default sortedByHue;
