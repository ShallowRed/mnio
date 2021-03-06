import {
  Help,
  helpBlocks,
  helpContainer,
  arrows
} from './components/help';

const blockArrows = {
  zoom: arrows[0],
  fill: arrows[1]
}

const Tutoriel = {

  init(socket) {

    const showHowToFill = () => {
      showBlock("fill");
      socket.on("confirmFill", onFirstFill);
    };

    const onFirstFill = () => {
      socket.removeListener("confirmFill", onFirstFill);
      hideBlock("fill");
      setTimeout(showHowToMove, 1000);
    }

    const showHowToMove = () => {
      showBlock("move");
      socket.on("newPlayerPos", onFirstMove);
    };

    const onFirstMove = () => {
      socket.removeListener("newPlayerPos", onFirstMove);
      hideBlock("move");
      setTimeout(showLastInfos, 1000);
    }

    const showLastInfos = () => {
      Help.show();
      showBlock("zoom");
      setTimeout(Tutoriel.end, 3000);
    };

    helpContainer.style.display = "block";
    setTimeout(showHowToFill, 1000);
  },

  end() {
    showBlock("zoom", "move", "fill");
    Help.hide();
    Help.listenBtn();
  }
}

const hideBlock = (...args) => {
  args.forEach(key => {
    helpBlocks[key].style.visibility = "hidden";
    if (blockArrows[key]) {
      blockArrows[key].style.visibility = "hidden";
    }
  });
};

const showBlock = (...args) => {
  args.forEach(key => {
    helpBlocks[key].style.visibility = "visible";
    if (blockArrows[key]) {
      blockArrows[key].style.visibility = "visible";
    }
  });
};

export default Tutoriel;
