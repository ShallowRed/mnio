const menuCaptions = document.querySelectorAll('#menu p');

const helpContainer = document.getElementById('info');

const helpBlocks = {

  fill: {
    domEl: document.getElementById('info-block-fill'),
    message: {
      mobile: `<h3>Colorier</h3>`,
      desktop: `
      <h3>Colorier</h3>
      <p>ou <img src="dist/img/icons/key-space.png" alt=""></p>
      <p><img src="dist/img/icons/key-ctrl.png" alt=""> Couleur up</p>
      <p><img src="dist/img/icons/key-shift.png" alt=""> Couleur down</p>
      `
    },
    style: {
      // width: ["35%", "40%"],
      // height: ["35%", "25%"],
      // top: ["40%", "60%"],
      // bottom: ["25%", "15%"],
      // right: ["15%", "5%"]
      // left: ["50%", "40%"]
    }
  },

  move: {
    domEl: document.getElementById('info-block-move'),
    message: {
      mobile: `
      <h3>Se déplacer</h3>
      <p><img src="dist/img/icons/swipe.png" alt=""></p>
      `,
      desktop: `
      <h3>Se déplacer</h3>
      <p><img src="dist/img/icons/pcmove.png" alt=""></p>
      `
    },
    style: {
      // width: ["35%", "40%"],
      // height: ["35%", "40%"],
      // top: ["40%", "10%"],
      // left: ["5%", "40%"]
    }
  },

  zoom: {
    domEl: document.getElementById('info-block-zoom'),
    message: {
      mobile: `<h3>Zoomer / Dézoomer</h3>`,
      desktop: `
      <h3>Zoomer</h3>
      <p>ou <img src="dist/img/icons/key-alt.png" alt=""> +
      <img src="dist/img/icons/key-z.png" alt=""></p>
      <h3>Dézoomer</h3>
      <p>ou <img src="dist/img/icons/key-alt.png" alt=""> +
      <img src="dist/img/icons/key-s.png" alt=""></p>
      `
    },
    style: {
      // bottom: ["60%", "15%"],
      // right: ["15%", "5%"]
      // width: ["35%", "30%"],
      // height: ["25%", "25%"],
      // top: ["10%", "60%"],
      // left: ["50%", "5%"]
    }
  }
};

const blocks = document.querySelectorAll("#info>div");

const styles = [{
  top: ["50%", "50%"],
  left: ["50%", "50%"],
  transform: ["translate(-50%, -50%)", "translate(-50%, -50%)"],
}, {
  width: ["auto", "100%"],
  right: ["15%", "auto"],
  top: ["50%", "75%"],
  flexDirection: ["column", "row"],
  transform: ["translateY(-50%)", "translate(0)"],
}]

const Help = {

  init() {
    for (const { domEl, message } of Object.values(helpBlocks)) {
      domEl.innerHTML = message[isMobile ? "mobile" : "desktop"];
    }
  },

  render() {
    const ratio = isWidthLarger();
    styles.forEach((blockStyle, i) => {
      for (const [key, value] of Object.entries(blockStyle)) {
        blocks[i].style[key] = value[ratio ? 0 : 1];
      }
    });
  },

  listenBtn() {
    const helpBtn = document.getElementById('help');
    helpBtn.addEventListener("click", () => {
      if (helpContainer.style.display !== "none") {
        this.hide();
      } else {
        this.show();
      }
    })
  },

  hide() {
    [helpContainer, ...menuCaptions].forEach(el => {
      el.style.display = "none";
    });
  },

  show() {
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
