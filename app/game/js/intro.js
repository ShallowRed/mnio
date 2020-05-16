import GAME from './game';
import pokedex from './pokedex';

const lobby = document.getElementById('lobby');
const roulette = document.getElementById('roulette');
const select = document.getElementById('select');
const palette = document.querySelectorAll(".pal");
const rdm = document.getElementById('rdm');
const tapisserie = {
  img: document.getElementById("tapImg"),
  description: document.getElementById("tapDesc")
}

let index;

const changeTap = () => {
  index = Math.floor(Math.random() * pokedex.length);
  const tap = pokedex[index]
  tapisserie.img.src = 'dist/img/pokedex/tap_' + (index + 1) + '.jpg';
  tapisserie.description.innerHTML = tap.description;
  palette.forEach((pal, i) => pal.style.backgroundColor = tap.palette[i]);
}

rdm.addEventListener("click", () => changeTap())
changeTap();

const Intro = (data, socket, admin) => {
  console.log(data);
  if (data.new) firstVisit(data, socket, admin);
  else GAME.init(data, socket, admin);
  hide(lobby);
}

const firstVisit = (data, socket, admin) => {
  roulette.style.display = "block";
  select.addEventListener("click", () => selectPalette(data, socket, admin, index))
};

const selectPalette = (data, socket, admin, index) => {
  data.colors = pokedex[index].palette;
  GAME.init(data, socket, admin);
  socket.emit("selectPalette", index);
  roulette.style.display = "none";
}

const hide = (elem) => {
  elem.style.opacity = "0";
  setTimeout(() => elem.style.display = "none", 300);
}

// TODO: player position defined before tap selection -> wrong !!

export default Intro;
