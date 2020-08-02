import GAME from './components/game';
import TUTO from './tuto';
import Pokedex from './components/pokedex';

const tap = {
  index: null,
  img: document.getElementById("tapImg"),
  description: document.getElementById("description")
}

let indexList = Pokedex.map((e, i) => i)

const changeTap = () => {
  if (!indexList.length) indexList = Pokedex.map((e, i) => i);
  let rdmIndex = Math.floor(Math.random() * indexList.length);
  tap.index = indexList[rdmIndex];
  indexList = indexList.filter(e => e !== tap.index);
  tap.img.src = 'dist/img/pokedex/tap_' + (tap.index + 1) + '.jpg';
  tap.description.innerHTML = Pokedex[tap.index].description;
  document.querySelectorAll(".pal").forEach((colorButton, i) =>
    colorButton.style.backgroundColor = Pokedex[tap.index].palette[i]
  );
}

document.getElementById('rdm').addEventListener("click", () =>
  changeTap()
);

changeTap();

const Intro = (data, socket) => {
  if (data.new)
    newPlayer(data, socket);
  else
    returningPlayer(data, socket);
  hide(document.getElementById('lobby'));
}

const newPlayer = (data, socket) => {
  document.getElementById('intro').style.display = "flex";
  document.getElementById('select').addEventListener("click", () =>
    selectPalette(data, socket, tap.index)
  );
};

const returningPlayer = (data, socket) => {
  TUTO.phase.inGame();
  GAME.init(data, socket);
};

const selectPalette = (data, socket, index) => {
  data.colors = Pokedex[index].palette;
  socket.emit("paletteSelected", index);
  socket.on("startPos", position => {
    data.position = position;
    TUTO.phase.welcome();
    GAME.init(data, socket);
    hide(document.getElementById('intro'));
  })
}

const hide = e => {
  e.style.opacity = "0";
  setTimeout(() => e.style.display = "none", 300);
}

export default Intro;
