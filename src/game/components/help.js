const menuCaptions = document.querySelectorAll('#menu p');

const helpContainer = document.getElementById('help');

const helpBlocks = {
  fill: document.getElementById('help-block-fill'),
  move: document.getElementById('help-block-move'),
  zoom: document.getElementById('help-block-zoom'),
};

const helpIcon = document.querySelector('#help-btn img');

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
    mobile: `<h2>Zoomer / Dézoomer</h2>`,
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

const blocks = document.querySelectorAll("#help>div");

const styleAccordingToRatio = [{
  domEl: blocks[0],
  styles: {
    top: ["50%", "50%"],
    left: ["50%", "50%"],
    transform: ["translate(-50%, -50%)", "translate(-50%, -50%)"],
  }
}, {
  domEl: blocks[1],
  styles: {
    width: ["auto", "100%"],
    right: ["15%", "auto"],
    top: ["50%", "auto"],
    bottom: ["auto", "15%"],
    flexDirection: ["column", "row"],
    transform: ["translateY(-50%)", "translate(0)"],
  }
}]

// const styles = [{
//   top: ["50%", "50%"],
//   left: ["50%", "50%"],
//   transform: ["translate(-50%, -50%)", "translate(-50%, -50%)"],
// }, {
//   width: ["auto", "100%"],
//   right: ["15%", "auto"],
//   top: ["50%", "auto"],
//   bottom: ["auto", "15%"],
//   flexDirection: ["column", "row"],
//   transform: ["translateY(-50%)", "translate(0)"],
// }]

const Help = {

  init() {
    for (const [key, domEl] of Object.entries(helpBlocks)) {
      domEl.innerHTML = messages[key][isMobile ? "mobile" : "desktop"];
    }
  },

  render() {
    const ratio = isWidthLarger();
    styleAccordingToRatio.forEach(({ domEl, styles }) => {
      for (const [key, value] of Object.entries(styles)) {
        domEl.style[key] = value[ratio ? 0 : 1];
      }
    });


  },
  //
  // render() {
  //   const ratio = isWidthLarger();
  //   styles.forEach((blockStyle, i) => {
  //     for (const [key, value] of Object.entries(blockStyle)) {
  //       blocks[i].style[key] = value[ratio ? 0 : 1];
  //     }
  //   });
  // },

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

const isWidthLarger = () => {
  return window.innerWidth > window.innerHeight;
};

export {
  Help,
  helpBlocks,
  helpContainer,
  menuCaptions
}
