import './paletteSelection.css'
import '../global.css';

import Pokedex from '../../srv/datadev/pokedex/Pokedex';

import io from 'socket.io-client';

const socket = io('/palette');

socket.on('redirect', path =>
  window.location = path)

const initPaletteSelection = () => {
  changeTapestry();

  window.addEventListener("load", () => {
    const container = document.querySelector('.container');
    container.style.opacity = 1;
  });

  const changeBtn = document.querySelector('.tap-change');
  const selectBtn = document.querySelector('.tap-select');

  changeBtn.addEventListener("click", changeTapestry);

  selectBtn.addEventListener("click", () => {
    socket.emit("paletteSelected", tapestry.index);
    window.location = "./game";
  });
};

const tapestry = {
  index: null,
  img: document.querySelector(".container img"),
  description: document.querySelector(".container h3")
};

let indexList = Pokedex.map((e, i) => i);

const palette = document.querySelectorAll(".palette>div");

const changeTapestry = () => {
  if (!indexList.length)
    indexList = Pokedex.map((e, i) => i);

  const rdmIndex = Math.floor(Math.random() * indexList.length);
  tapestry.index = indexList[rdmIndex];
  indexList.splice(indexList.indexOf(tapestry.index), 1);
  tapestry.img.src = `/dist/img/pokedex/tap_${tapestry.index + 1}.jpg`
  tapestry.description.innerHTML = Pokedex[tapestry.index].description;

  palette.forEach((colorButton, i) =>
    colorButton.style.backgroundColor = Pokedex[tapestry.index].palette[i]
  );
};

initPaletteSelection();
