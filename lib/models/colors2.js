/////////////// Method to extract colors ///////////////

const myc = "#0b2536 #b7b4c7 #253266 #ba2420 #6e1a17 #cd4039 #e33d33 #f59d52 #295ba6 #C93426 #5A7333 #0D1440 #070662 #F2F2F2 #5B89A6 #D21608 #72AE5C #F7CA12 #731F2E #F2BC8D #F27777 #F2D544 #BF7330 #0a0b0d #607EA6 #96B9D9 #F2A35E #696187 #BA7647 #A84047 #F21313 #355493 #688061 #FBBB47 #BBCE4A #902B2B #2D2F59 #A65369 #BF9180 #8688A6 #F2B28D #BF4141 #1237A6 #4A88D9 #F2B90C #C39A21 #C75356 #376BB7 #F0C8A5 #1D1D19 #D40B0B #5A3B56 #F2CDAC #D99E91 #829984 #732C39 #F24C3D #1C2B59 #3C5973 #F2C6A0 #F2D06B #204E54 #A6442E #791C1E #012340 #D0A47E #9E63A6 #305AD9 #D99036 #72A6D4 #22402F #F2D7B6 #D9B54A #F2A81D #D96236 #0F468C #39403E #952522 #A64153 #41271A #C74E41 #CD5E2D #615E2A #D9AB53 #26241E #A9BED9 #A69460 #0A2D73 #FCF2ED #D91E1E";

function extract(src) {
  let colorList = src.split(' ');
  let paletteList = new Array(colorList.length / 3);
  for (let i = 0; i < colorList.length; i += 3) {
    let palette = [colorList[i], colorList[i + 1], colorList[i + 2]];
    paletteList[i / 3] = palette;
  }
  return paletteList;
}

// console.log(extract(myc));

///////////////////////////////////////////////////////////////////////////

const palettes = [
  ['#0b2536', '#b7b4c7', '#253266'],
  ['#ba2420', '#6e1a17', '#cd4039'],
  ['#e33d33', '#f59d52', '#295ba6'],
  ['#C93426', '#5A7333', '#0D1440'],
  ['#070662', '#F2F2F2', '#5B89A6'],
  ['#D21608', '#72AE5C', '#F7CA12'],
  ['#731F2E', '#F2BC8D', '#F27777'],
  ['#F2D544', '#BF7330', '#0a0b0d'],
  ['#607EA6', '#96B9D9', '#F2A35E'],
  ['#696187', '#BA7647', '#A84047'],
  ['#F21313', '#355493', '#688061'],
  ['#FBBB47', '#BBCE4A', '#902B2B'],
  ['#2D2F59', '#A65369', '#BF9180'],
  ['#8688A6', '#F2B28D', '#BF4141'],
  ['#1237A6', '#4A88D9', '#F2B90C'],
  ['#C39A21', '#C75356', '#376BB7'],
  ['#F0C8A5', '#1D1D19', '#D40B0B'],
  ['#5A3B56', '#F2CDAC', '#D99E91'],
  ['#829984', '#732C39', '#F24C3D'],
  ['#1C2B59', '#3C5973', '#F2C6A0'],
  ['#F2D06B', '#204E54', '#A6442E'],
  ['#791C1E', '#012340', '#D0A47E'],
  ['#9E63A6', '#305AD9', '#D99036'],
  ['#72A6D4', '#22402F', '#F2D7B6'],
  ['#D9B54A', '#F2A81D', '#D96236'],
  ['#0F468C', '#39403E', '#952522'],
  ['#A64153', '#41271A', '#C74E41'],
  ['#CD5E2D', '#615E2A', '#D9AB53'],
  ['#26241E', '#A9BED9', '#A69460'],
  ['#0A2D73', '#FCF2ED', '#D91E1E']
]

function randompalette() {
  let rdmpalette = palettes[Math.floor(Math.random() * palettes.length)];
  return rdmpalette;
}

module.exports = randompalette;
