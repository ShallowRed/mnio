const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent);

const helpContainer = document.getElementById('info');
const menuCaptions = document.querySelectorAll('#menu p');
const help = document.getElementById('help');

const ratio = window.innerWidth > window.innerHeight;

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
      width: ["35%", "40%"],
      height: ["35%", "25%"],
      top: ["40%", "60%"],
      left: ["50%", "40%"]
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
      width: ["35%", "40%"],
      height: ["35%", "40%"],
      top: ["40%", "10%"],
      left: ["5%", "40%"]
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
      width: ["35%", "30%"],
      height: ["25%", "25%"],
      top: ["10%", "60%"],
      left: ["50%", "5%"]
    }
  }
};

const Tutoriel = {

  setMessages() {
    for (const [key, helpBlock] of Object.entries(helpBlocks)) {
      helpBlock.domEl.innerHTML =
        helpBlock.message[isMobile ? "mobile" : "desktop"];
      this.setStyle(helpBlock);
    }
  },

  setStyle(helpBlock) {
    for (const [key, value] of Object.entries(helpBlock.style)) {
      helpBlock.domEl.style[key] = value[ratio ? 0 : 1];
    }
  },

  init(socket) {
    helpContainer.style.display = "block";

    setTimeout(() => {
      show([helpBlocks.fill.domEl]);
      socket.on("confirmFill", firstFill);
    }, 1000)

  },

  end() {

    show([
      helpBlocks.zoom.domEl,
      helpBlocks.move.domEl,
      helpBlocks.fill.domEl
    ]);

    hide([helpContainer, ...menuCaptions]);

    help.addEventListener("click", () => {
      const toggle = helpContainer.style.display !== "none" ? hide : show;
      toggle([helpContainer, ...menuCaptions]);
    })
  }
}

function firstFill() {
  this.removeListener("confirmFill", firstFill);
  hide([helpBlocks.fill.domEl]);
  setTimeout(() => {
    show([helpBlocks.move.domEl]);
    this.on("newPlayerPos", firstMove);
  }, 1000);
}

function firstMove() {
  this.removeListener("newPlayerPos", firstMove);
  hide([helpBlocks.move.domEl]);
  setTimeout(() => {
    show([helpBlocks.zoom.domEl, ...menuCaptions]);
    setTimeout(Tutoriel.end, 3000);
  }, 1000);
}

const hide = (args) => {
  [...args].forEach(p => {
    p.style.display = "none";
  });
};

const show = (args) => {
  [...args].forEach(p => {
    p.style.display = "block";
  });
};

export default Tutoriel;
