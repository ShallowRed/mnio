import ScreenRatio from '../utils/styleAccordingToRatio'

const menuCaptions = document.querySelectorAll('#menu p');
const helpContainer = document.getElementById('help');
const blocks = document.querySelectorAll("#help>div");
const helpIcon = document.querySelector('#help-btn img');
const helpBlocks = {
  fill: document.getElementById('help-block-fill'),
  move: document.getElementById('help-block-move'),
  zoom: document.getElementById('help-block-zoom'),
};
const arrows = document.querySelectorAll("#help svg");

const messages = {

  fill: {
    mobile: `<h2>Colorier</h2>`,
    desktop: `
      <h3>Colorier</h3>
      <hr>
      <p>ou <img src="dist/img/icons/key-space.png" alt=""></p>
      <p><img src="dist/img/icons/key-shift.png" alt=""> Couleur &#8593;</p>
      <p><img src="dist/img/icons/key-ctrl.png" alt=""> Couleur &#8595;</p>
      `
  },

  move: {
    mobile: `
      <h2>Se déplacer</h2>
      <p><img src="dist/img/icons/swipe.png" alt=""></p>
      `,
    desktop: `
      <h3>Se déplacer</h3>
      <hr>
      <p><img src="dist/img/icons/pcmove.png" alt=""></p>
      `
  },

  zoom: {
    mobile: `
    <h2>(dé)Zoomer</h2>
    `,
    desktop: `
      <h3>Zoomer</h3>
      <hr>
      <p>ou <img src="dist/img/icons/key-alt.png" alt=""> +
      <img src="dist/img/icons/key-z.png" alt=""></p>
      <h3>Dézoomer</h3>
      <hr>
      <p>ou <img src="dist/img/icons/key-alt.png" alt=""> +
      <img src="dist/img/icons/key-s.png" alt=""></p>
      `
  }
};

const Help = {

  init() {
    for (const [key, domEl] of Object.entries(helpBlocks)) {
      domEl.innerHTML = messages[key][isMobile ? "mobile" : "desktop"];
    }
  },

  render() {

    ScreenRatio.applyStyles({
      domEl: helpBlocks.move,
      styles: {
        top: ["73%", "19%"],
        left: ["22%", "75%"],
        transform: ["translate(-50%, -50%)", "translate(-50%, -50%)"],
      }
    }, {
      domEl: blocks[1],
      styles: {
        width: ["auto", "100%"],
        right: ["13%", "auto"],
        top: ["50%", "auto"],
        bottom: ["auto", "13%"],
        flexDirection: ["column", "row"],
        transform: ["translateY(-50%)", "translate(0)"],
      }
    }, ...[helpBlocks.zoom, helpBlocks.fill].map(block => ({
      domEl: block,
      styles: {
        width: ["auto", "30%"],
        marginBottom: [isMobile ? "20vh" : "3vh", "4.5px"],
        marginTop: ["5px", "auto"],
        height: ["auto", "100%"],
      }
    })), ...[...arrows].map(arrow => ({
      domEl: arrow,
      styles: {
        right: ["8px", "auto"],
        bottom: ["auto", "-5px"],
        transform: ["translateX(100%) scale(1.5)",
          "scale(1.5) rotate(90deg) "
        ]
      }
    })), {
      domEl: arrows[0],
      styles: {
        top: [isMobile ? "6%" : "20%", "auto"],
        left: ["auto", "22%"],
      }
    }, {
      domEl: arrows[1],
      styles: {
        top: [isMobile ? "56%" : "60%", "auto"],
        left: ["auto", "62%"],
      }
    })
  },

  listenBtn() {
    const helpBtn = document.getElementById('help-btn');
    helpBtn.addEventListener("click", () => {
      const toggleVisibility =
        helpContainer.style.display !== "none" ?
        "hide" : "show";
      this[toggleVisibility]();
    })
  },

  hide() {
    helpIcon.src = `dist/img/icons/help.png`;
    [helpContainer, ...menuCaptions].forEach(el => {
      el.style.display = "none";
    });
  },

  show() {
    helpIcon.src = `dist/img/icons/close.png`;
    [helpContainer, ...menuCaptions].forEach(el => {
      el.style.display = "block";
    });
  }
}

const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent);

export {
  Help,
  helpBlocks,
  helpContainer,
  menuCaptions,
  arrows
}
