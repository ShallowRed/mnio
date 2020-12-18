const TUTO = {

  window: document.getElementById('tuto'),
  introTuto: document.getElementById('introTuto'),
  mobile: document.getElementById('mobileTuto'),
  pc: document.getElementById('pcTuto'),
  all: document.getElementById('allTuto'),
  info: document.getElementById('info'),
  lastInfo: document.getElementById('lastInfo'),
  text: document.getElementById('textInfo'),
  help: document.getElementById('help'),
  moveImg: document.getElementById('moveImg'),
  moveIcon: document.getElementById('moveIcon'),
  openTuto: document.querySelector("#openTuto img"),
  refresh: document.querySelector("#refresh img"),

  btn: {
    follow: document.getElementById('follow'),
    skip: document.getElementById('skip'),
    play: document.getElementById('play'),
  },

  setMsg: key =>
    TUTO.text.innerHTML = TUTO.message[key],

  isFirstFill: event =>
    event.keyCode == 32 && firstFill,

  isFirstMove: event =>
    firstMove &&  (
      event.keyCode == 37 ||
      event.keyCode == 38 ||
      event.keyCode == 39 ||
      event.keyCode == 40
    )
};

let firstFill = false;
let firstMove = false;

console.log(TUTO);

const Messages = {

  desktop: {
    welcome: "Bienvenue ! Vous venez d'être placé.e sur une tapisserie. D'autres joueurs y sont présents !",
    fill: "Vous pouvez changer de couleurs avec les touches CTRL et MAJ, colorier une case avec la barre espace ou en cliquant sur une couleur.",
    move: "Bravo, cette case est à vous ! Vous pouvez désormais vous déplacer sur les cases grises.",
    info: "Félicitations, vous êtes prêt.e à dessiner !",
  },

  mobile: {
    welcome: "Bienvenue ! Vous venez d'être placé.e sur une tapisserie. D'autres joueurs y sont présents !",
    fill: "Vous pouvez colorier une case en cliquant sur une des couleurs que vous possedez. &#8595;",
    move: "Déplacez vous !",
    info: "Félicitations, vous êtes prêt.e à dessiner !",
  }
}

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent);

TUTO.init = () => {

  TUTO.message = Messages[isMobile ? "desktop" : "mobile"];

  TUTO.moveIcon.src = `dist/img/${isMobile ? 'swipe' : 'pcmove'}.png`;

  TUTO.btn.follow.addEventListener("click", () => {
    firstFill = true;
    Phase.fill();
    document.addEventListener('keydown', event => {
      if (TUTO.isFirstFill(event))
        Phase.move();
      else if (TUTO.isFirstMove(event))
        Phase.info();
    })
  });

  document.querySelectorAll('.color')
    .forEach(e => {
      e.addEventListener("touchstart", event => {
        event.preventDefault();
        if (firstFill)
          Phase.move();
      });
      e.addEventListener("click", () => {
        if (firstFill)
          Phase.move();
      })
    });

  document.addEventListener("touchstart", event => {
    event.preventDefault();
    if (firstMove) TUTO.touch = [event.touches[0].clientX, event
      .touches[0].clientY
    ]
  });

  document.addEventListener("touchmove", event => {
    event.preventDefault();
    if (firstMove && TUTO.touch) {
      const delta = [Math.abs(TUTO.touch[0] - event.touches[0].clientX),
        Math.abs(TUTO.touch[1] - event.touches[0].clientY)
      ];
      if (delta[0] > 5 || delta[1] > 5)
        Phase.info();
    }
  });

  Phase.welcome();
  TUTO.btn.skip.addEventListener("click", () => Phase.last());
  TUTO.btn.play.addEventListener("click", () => Phase.last());
};

const Phase = {

  welcome: () => {
    TUTO.window.style.display = "block";
    TUTO.window.style.background = "transparent";
    show(TUTO.introTuto);
    setTimeout(() => TUTO.window.style.opacity = "1", 1000);
    show(TUTO.info);
    show(TUTO.text);
    show(TUTO.btn.follow);
    show(TUTO.btn.skip);
    TUTO.setMsg("welcome");
  },

  fill: () => {
    hide(TUTO.btn.follow, true);
    hide(TUTO.btn.skip, true);
    TUTO.setMsg("fill");
  },

  move: () => {
    firstFill = false;
    hide(TUTO.window, true);
    TUTO.setMsg("move");
    setTimeout(() => {
      show(TUTO.window);
      show(TUTO.moveImg);
      show(TUTO.moveIcon);
      if (isMobile) setTimeout(() => {
        hide(TUTO.window);
        firstMove = true;
      }, 1500);
      else firstMove = true;
    }, 1000);
  },

  info: () => {
    firstMove = false;
    hide(TUTO.window, true);
    hide(TUTO.moveImg, true);
    hide(TUTO.moveIcon, true);
    TUTO.setMsg("info");
    show(TUTO.lastInfo);
    setTimeout(() => {
      show(TUTO.window);
      setTimeout(() => Phase.last(), 3000)
    }, 500)
  },

  last: () => {
    hide(TUTO.introTuto);
    hide(TUTO.window);
    setTimeout(() => TUTO.end(), 500);
  }
};

TUTO.end = () => {
  hide(TUTO.help);
  if (isMobile)
    TUTO.mobile.style.display = "block";
  else
    TUTO.pc.style.display = "block";
  TUTO.all.style.display = "block";
  TUTO.window.style.background = "var(--grey)";
};

const hide = (elem, instant) => {
  if (instant) elem.style.display = "none";
  else {
    elem.style.opacity = "0";
    setTimeout(() => elem.style.display = "none", 500);
  }
};

const show = (elem) => {
  elem.style.display = "block";
  setTimeout(() => elem.style.opacity = "1", 50);
};

export default TUTO;
