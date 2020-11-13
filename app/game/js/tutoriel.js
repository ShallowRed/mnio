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

  pcMessage: {
    welcome: "Bienvenue ! Vous venez d'être placé.e sur une tapisserie. D'autres joueurs y sont présents !",
    fill: "Vous pouvez changer de couleurs avec les touches CTRL et MAJ, colorier une case avec la barre espace ou en cliquant sur une couleur.",
    move: "Bravo, cette case est à vous ! Vous pouvez désormais vous déplacer sur les cases grises.",
    info: "Félicitations, vous êtes prêt.e à dessiner !",
  },

  mobileMessage: {
    welcome: "Bienvenue ! Vous venez d'être placé.e sur une tapisserie. D'autres joueurs y sont présents !",
    fill: "Vous pouvez colorier une case en cliquant sur une des couleurs que vous possedez. &#8595;",
    move: "Déplacez vous !",
    info: "Félicitations, vous êtes prêt.e à dessiner !",
  },

  setMsg: e => TUTO.text.innerHTML = TUTO.message[e],

  firstFill: false,
  firstMove: false,
  isFirstFill: event => event.keyCode == 32 && TUTO.firstFill,
  isFirstMove: event => (event.keyCode == 37 || event.keyCode == 38 || event
    .keyCode == 39 || event.keyCode == 40) && TUTO.firstMove,

}

TUTO.init = () => {

  TUTO.isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent);
  TUTO.message = TUTO.isMobile ? TUTO.mobileMessage : TUTO.pcMessage;
  TUTO.moveIcon.src = 'dist/img/' + (TUTO.isMobile ? 'swipe' : 'pcmove') +
    '.png';

  TUTO.btn.follow.addEventListener("click", () => {
    TUTO.firstFill = true;
    TUTO.phase.fill();
    document.addEventListener('keydown', event => {
      if (TUTO.isFirstFill(event)) TUTO.phase.move();
      else if (TUTO.isFirstMove(event)) TUTO.phase.info();
    })
  });

  document.querySelectorAll('.color')
    .forEach(e => {
      e.addEventListener("touchstart", event => {
        event.preventDefault();
        if (TUTO.firstFill) TUTO.phase.move();
      });
      e.addEventListener("click", () => {
        if (TUTO.firstFill) TUTO.phase.move();
      })
    });

  document.addEventListener("touchstart", event => {
    event.preventDefault();
    if (TUTO.firstMove) TUTO.touch = [event.touches[0].clientX, event
      .touches[0].clientY
    ]
  });

  document.addEventListener("touchmove", event => {
    event.preventDefault();
    if (TUTO.firstMove && TUTO.touch) {
      TUTO.delta = [Math.abs(TUTO.touch[0] - event.touches[0].clientX),
        Math.abs(TUTO.touch[1] - event.touches[0].clientY)
      ];
      if (TUTO.delta[0] > 5 || TUTO.delta[1] > 5) TUTO.phase.info();
    }
  });

  TUTO.btn.skip.addEventListener("click", () => TUTO.phase.last());
  TUTO.btn.play.addEventListener("click", () => TUTO.phase.last());
};

TUTO.init = () => {
  hide(document.getElementById('intro'));
  TUTO.phase.welcome();
};

TUTO.phase = {

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
    TUTO.firstFill = false;
    hide(TUTO.window, true);
    TUTO.setMsg("move");
    setTimeout(() => {
      show(TUTO.window);
      show(TUTO.moveImg);
      show(TUTO.moveIcon);
      if (TUTO.isMobile) setTimeout(() => {
        hide(TUTO.window);
        TUTO.firstMove = true;
      }, 1500);
      else TUTO.firstMove = true;
    }, 1000);
  },

  info: () => {
    TUTO.firstMove = false;
    hide(TUTO.window, true);
    hide(TUTO.moveImg, true);
    hide(TUTO.moveIcon, true);
    TUTO.setMsg("info");
    show(TUTO.lastInfo);
    setTimeout(() => {
      show(TUTO.window);
      setTimeout(() => TUTO.phase.last(), 3000)
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
  if (TUTO.isMobile) TUTO.mobile.style.display = "block";
  else TUTO.pc.style.display = "block";
  TUTO.all.style.display = "block";
  TUTO.window.style.background = "var(--grey)";
}

const hide = (elem, instant) => {
  if (instant) elem.style.display = "none";
  else {
    elem.style.opacity = "0";
    setTimeout(() => elem.style.display = "none", 500);
  }
}

const show = (elem) => {
  elem.style.display = "block";
  setTimeout(() => elem.style.opacity = "1", 50);
}

TUTO.init();

export default TUTO;
