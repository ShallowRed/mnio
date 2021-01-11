const btnList = document.getElementById('list');

export default function createGameButton(number, callback) {
  const gameData = require(
    `../../../srv/data/games.min/game.min.${number}.json`)
  const button = createButton(gameData);
  button.addEventListener("click", () =>
    requestGame(gameData.id, callback)
  );
}

function createButton({ id, rows, cols }) {
  const button = document.createElement('button');
  button.type = "submit";
  button.innerHTML = `mnio.00${id}, ${rows} x ${cols} px`;
  btnList.appendChild(button);
  button.id = `game${id}`;
  return button;
}

function requestGame(id, callback) {

  const requestGameData = new XMLHttpRequest();
  requestGameData.open('PUT', '/game');
  requestGameData.setRequestHeader('Content-Type', 'application/json');

  requestGameData.onload = () => {
    callback(requestGameData);
  };

  window.addEventListener('popstate', () => {
    window.location.replace("../gallery")
  }, false);

  requestGameData.send(JSON.stringify({ id }));
}
