import Pokedex from './components/pokedex';

const paletteSelection = {

  init: (socket) => {
    document.getElementById('rdm')
      .addEventListener("click", changeTap);

    changeTap();

    document.getElementById('intro')
      .style.display = "flex";

    document.getElementById('select')
      .addEventListener("click", () => {
        socket.emit("paletteSelected", tap.index);
      });
  }
};

const tap = {
  index: null,
  img: document.getElementById("tapImg"),
  description: document.getElementById("description")
};

let indexList = Pokedex.map((e, i) => i);

const changeTap = () => {
  if (!indexList.length) indexList = Pokedex.map((e, i) => i);
  let rdmIndex = Math.floor(Math.random() * indexList.length);
  tap.index = indexList[rdmIndex];
  indexList = indexList.filter(e => e !== tap.index);
  tap.img.src = 'dist/img/pokedex/tap_' + (tap.index + 1) + '.jpg';
  tap.description.innerHTML = Pokedex[tap.index].description;
  document.querySelectorAll(".pal")
    .forEach((colorButton, i) =>
      colorButton.style.backgroundColor = Pokedex[tap.index].palette[i]
    );
};

export default paletteSelection;
