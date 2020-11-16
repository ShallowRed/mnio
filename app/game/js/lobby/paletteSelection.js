import Pokedex from '../../../../lib/pokedex/Pokedex';

const paletteSelection = {

  init: (socket) => {
    document.getElementById('rdm')
      .addEventListener("click", changeTap);

    changeTap();

    document.getElementById('intro')
      .style.display = "flex";

    document.getElementById('select')
      .addEventListener("click", () => {
        socket.emit("paletteSelected", tapestry.index);
      });
  }
};

const tapestry = {
  index: null,
  img: document.getElementById("tapImg"),
  description: document.getElementById("description")
};

let indexList = Pokedex.map((e, i) => i);

const changeTap = () => {
  if (!indexList.length)
    indexList = Pokedex.map((e, i) => i);
  let rdmIndex = Math.floor(Math.random() * indexList.length);
  tapestry.index = indexList[rdmIndex];
  indexList = indexList.filter(e => e !== tapestry.index);
  tapestry.img.src = `dist/img/pokedex/tap_${tapestry.index + 1}.jpg`
  tapestry.description.innerHTML = Pokedex[tapestry.index].description;
  document.querySelectorAll(".pal")
    .forEach((colorButton, i) =>
      colorButton.style.backgroundColor = Pokedex[tapestry.index].palette[i]
    );
};

export default paletteSelection;
