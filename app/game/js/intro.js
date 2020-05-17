import GAME from './components/game';
import pokedex from './components/pokedex';
import tuto from './tuto';

const lobby = document.getElementById('lobby');
const intro = document.getElementById('intro');
const select = document.getElementById('select');
const palette = document.querySelectorAll(".pal");
const rdm = document.getElementById('rdm');
const tap = {
  index: null,
  img: document.getElementById("tapImg"),
  description: document.getElementById("description")
}

let indexList = pokedex.map((e, i) => i)

const changeTap = () => {
  if (!indexList.length) indexList = pokedex.map((e, i) => i);
  let rdmIndex = Math.floor(Math.random() * indexList.length);
  tap.index = indexList[rdmIndex];
  indexList = indexList.filter(e=> e !== tap.index);
  tap.img.src = 'dist/img/pokedex/tap_' + (tap.index + 1) + '.jpg';
  tap.description.innerHTML = pokedex[tap.index].description;
  palette.forEach((c, i) => c.style.backgroundColor = pokedex[tap.index].palette[i]);
}

rdm.addEventListener("click", () => changeTap())
changeTap();

const Intro = (data, socket, admin) => {
  if (data.new) newPlayer(data, socket, admin);
  else returningPlayer(data, socket, admin);
  hide(lobby);
}

const newPlayer = (data, socket, admin) => {
  intro.style.display = "flex";
  select.addEventListener("click", () => selectPalette(data, socket, admin, tap.index))
};

const returningPlayer = (data, socket, admin) => {
  tuto.static();
  GAME.init(data, socket, admin);
};

const selectPalette = (data, socket, admin, index) => {
  data.colors = pokedex[index].palette;
  socket.emit("setInit", index);
  socket.on("startPos", position => {
    data.position = position;
    tuto.animated();
    GAME.init(data, socket, admin);
    hide(intro);
  })
}

const hide = e => {
  e.style.opacity = "0";
  setTimeout(() => e.style.display = "none", 300);
}

export default Intro;
