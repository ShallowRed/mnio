const hexToHsl = require('hex-to-hsl');

const sortedByHue = (GAME) => {
  GAME.count = new Array(GAME.palette.length).fill(0);
  GAME.colors.forEach(e => GAME.count[e]++);

  return GAME.count
    .filter(e => e > 100)
    .map((e, i) => {
      return {
        color: "#" + GAME.palette[i],
        hue: hexToHsl("#" + GAME.palette[i])[0],
        amount: e
      }
    })
    .sort((a, b) => a.hue - b.hue).map(e => {
      return {
        color: e.color,
        amount: e.amount
      }
    })
}

export default sortedByHue;
