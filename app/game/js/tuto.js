const mobileTuto = document.getElementById('mobileTuto');
const pcTuto = document.getElementById('pcTuto');
const allTuto = document.getElementById('allTuto');

const tuto = {
  window: document.getElementById('tuto'),

  static: () => {
    console.log("yes");
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) mobileTuto.style.display = "block";
    else pcTuto.style.display = "block";
    allTuto.style.display = "block";
  },

  animated: () => {
    document.getElementById("playercanvas").style.zIndex = 900;
    tuto.window.style.display = "block";
    setTimeout(() => {
      tuto.window.style.opacity = "1";
    },1500)
  }

}

export default tuto;

// TODO:  color 4 and 5 darouste sans titre
