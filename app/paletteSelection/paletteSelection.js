import './paletteSelection.css'
import '../layouts/global.css';

import Pokedex from '../../lib/pokedex/Pokedex';

import io from 'socket.io-client';

const socket = io();

const paletteSelection = {

  init: (socket) => {
    document.getElementById('rdm')
      .addEventListener("click", changeTapestry);

    changeTapestry();

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

const changeTapestry = () => {
  if (!indexList.length)
    indexList = Pokedex.map((e, i) => i);

  const rdmIndex = Math.floor(Math.random() * indexList.length);
  tapestry.index = indexList[rdmIndex];
  indexList.splice(indexList.indexOf(tapestry.index), 1);
  tapestry.img.src = `/dist/img/pokedex/tap_${tapestry.index + 1}.jpg`
  tapestry.description.innerHTML = Pokedex[tapestry.index].description;

  document.querySelectorAll(".pal")
    .forEach((colorButton, i) =>
      colorButton.style.backgroundColor = Pokedex[tapestry.index].palette[i]
    );

    console.log(tapestry);
    console.log(indexList);
};

paletteSelection.init(socket);

// export default paletteSelection;
