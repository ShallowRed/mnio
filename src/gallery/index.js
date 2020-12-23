import './css/gamelist.css';
import './css/gallery.css';
import './css/canvas.css';
import './css/description.css';
import './css/switches.css';
import './css/playbar.css';
import './css/carton.css';
import './css/dataviz.css';

import APP from './js/components/gallery';

import * as game1 from '../../srv/data/games.min/game.min.1.json';
import * as game2 from '../../srv/data/games.min/game.min.2.json';
import * as game3 from '../../srv/data/games.min/game.min.3.json';

[game1, game2, game3].forEach(g => {

  const li = document.createElement('li');
  APP.list.appendChild(li);

  const button = document.createElement('button');
  button.type = "submit";
  button.innerHtml = `mnio.00${g.id}, ${g.rows} x ${g.cols} px`;
  li.appendChild(button);

  const h2 = document.createElement('h2');
  h2.innerHTML = `mnio.00${g.id}, ${g.rows} x ${g.cols} px`;
  button.appendChild(h2);

  button.id = `game${g.id}`;

  button.addEventListener("click", () => {

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', '/game');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        APP.init(res)
        window.history.pushState({
          "pageTitle": res.id
        }, "", "/gallery/mnio" + res.id);
      }
    };

    window.addEventListener('popstate', function(event) {
      window.location.replace("../gallery")
    }, false);

    xhr.send(JSON.stringify({
      id: g.id
    }));
  });
});


(() => {

  const cover = document.getElementById('cover');

  window.addEventListener('resize', () =>
    APP.update(), true
  );

  window.addEventListener("orientationchange", () =>
    setTimeout(() =>
      APP.update(), 500
    )
  );

  window.addEventListener("DOMContentLoaded", () => {
    cover.style.opacity = "0";
    setTimeout(() =>
      cover.style.display = "none", 200
    );
  });

  document.getElementById("logo")
    .addEventListener("click", () =>
      window.location.replace("../")
    )
})();
