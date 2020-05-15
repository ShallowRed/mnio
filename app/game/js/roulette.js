import pokedex from './pokedex';

const palette = document.querySelectorAll(".pal");
let index = 1;

const rdm = document.getElementById('rdm').addEventListener("click", () => {
  index = Math.floor(Math.random() * pokedex.length);
  changeTap();
})

const changeTap = () => {
  const tap = pokedex[index]
  document.getElementById("tapImg").src = 'dist/img/pokedex/tap_' + (index + 1) + '.jpg';
  document.getElementById("tapDesc").innerHTML = tap.description;
  palette.forEach((pal, i) => pal.style.backgroundColor = tap.palette[i]);
}

changeTap();
