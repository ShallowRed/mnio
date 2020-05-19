const TUTO = {

  window: document.getElementById('tuto'),
  introTuto: document.getElementById('introTuto'),
  mobile: document.getElementById('mobileTuto'),
  pc: document.getElementById('pcTuto'),
  all: document.getElementById('allTuto'),
  info: document.getElementById('info'),
  text: document.getElementById('textInfo'),
  moveImg: document.getElementById('moveImg'),
  moveIcon: document.getElementById('moveIcon'),

  btn: {
    follow: document.getElementById('follow'),
    skip: document.getElementById('skip'),
    play: document.getElementById('play'),
  },

  pcMessage: {
    welcome: "Bienvenue sur MN.io ! Vous venez d'être placé aléatoirement sur une tapisserie. D'autres joueurs y sont présents !",
    fill: "Vous pouvez colorier une case de la tapisserie en appuyant sur la barre espace.",
    move: "Bravo ! Vous possédez désormais cette case, personne ne pourra y aller ! Vous pouvez désormais vous déplacer sur les cases que vous contrôlez et sur les cases grises autour uniquement.",
    info: "Vous pouvez zoomer ici, retrouver les informations ici et raffraîchir ici.",
  },

  mobileMessage: {
    welcome: "Bienvenue sur MN.io ! Vous venez d'être placé aléatoirement sur une tapisserie. D'autres joueurs y sont présents !",
    fill: "Vous pouvez colorier une case de la tapisserie en cliquant sur une des couleurs que vous possedez.",
    move: "Bravo ! Vous possédez désormais cette case, personne ne pourra y aller ! Vous pouvez désormais vous déplacer sur les cases que vous contrôlez et sur les cases grises autour uniquement.",
    info: "Vous pouvez zoomer ici, retrouver les informations ici et raffraîchir ici.",
  },

  setMsg: e => TUTO.text.innerHTML = TUTO.message[e],

  firstFill: true,
  firstMove: false,
  isFirstFill: event => event.keyCode == 32 && TUTO.firstFill,
  isFirstMove: event => (event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40) && TUTO.firstMove,

}

TUTO.init = () => {

  TUTO.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  TUTO.message = TUTO.isMobile ? TUTO.mobileMessage : TUTO.pcMessage;
  TUTO.moveIcon.src = 'dist/img/' + (TUTO.isMobile ? 'swipe' : 'pcmove') +'.png';

  TUTO.btn.follow.addEventListener("click", () => {
    TUTO.phase.fill();
    document.addEventListener('keydown', event => {
      if (TUTO.isFirstFill(event)) {
console.log("firstfill");
        TUTO.phase.move()}
      else if (TUTO.isFirstMove(event)) {
        console.log("firstmove");

        TUTO.phase.info()};
    })
  });

  TUTO.btn.skip.addEventListener("click", () => TUTO.phase.end());
  TUTO.btn.play.addEventListener("click", () => TUTO.phase.end());
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
      TUTO.firstMove = true;
    }, 1000)
  },

  info: () => {
    hide(TUTO.window, true);
    hide(TUTO.moveImg, true);
    hide(TUTO.moveIcon, true);
    TUTO.setMsg("info");
    setTimeout(() => {
      TUTO.firstMove = false;
      show(TUTO.window);
      show(TUTO.btn.play);
    }, 1000)
  },

  end: () => {
    hide(TUTO.introTuto);
    hide(TUTO.window);
    setTimeout(() => TUTO.phase.inGame(), 500);
  },

  inGame: () => {
    if (TUTO.isMobile) TUTO.mobile.style.display = "block";
    else TUTO.pc.style.display = "block";
    TUTO.all.style.display = "block";
    TUTO.window.style.background = "var(--grey)";
  },
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
// TUTO.phase.welcome();

export default TUTO;
