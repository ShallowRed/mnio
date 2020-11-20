import { installPwa, onPwaInstalled } from './installation';
import { hide, show } from './utils';

export default function initListeners() {
  const lobbyWindow = document.querySelector('.lobby');
  const btnToGame = document.querySelectorAll('.lobby button')[1];

  window.addEventListener("load", () => {
    const logo = document.querySelector('#mnio-logo');
    logo.style.opacity = 1;
    lobbyWindow.style.opacity = 1;
  });

  let isInstallable = false;

  if (isAppleBrowser()) {
    isInstallable = true;
    proposeInstallation.apple();
  } else {
    if_IsRegularDevice(() => {
      isInstallable = true;
      proposeInstallation.regular()
    });
  }

  btnToGame.addEventListener("click", () => {
    const logWindow = document.querySelector('.login');
    hide(lobbyWindow);

    if (isInstallable) {
      const installWindow = document.querySelector('.installation');
      const stayInBrowserBtn = document.querySelector('.stay-btn');

      show(installWindow);

      stayInBrowserBtn.addEventListener('click', () => {
        hide(installWindow);
        show(logWindow);
      });
      return;
    }

    show(logWindow);
  });
}

const isAppleBrowser = () => ['iPhone', 'iPad', 'iPod'].includes(navigator
    .platform) &&
  !navigator.standalone;

const if_IsRegularDevice = fn =>
  window.addEventListener('beforeinstallprompt', () => {
    window.deferredPrompt = event;
    fn();
  });

const proposeInstallation = {

  apple() {
    const iosMessage = document.querySelector('.message-install-ios');
    show(iosMessage);
  },

  regular() {
    const installBtn = document.querySelector('.install-btn');
    show(installBtn);
    installBtn.addEventListener('click', installPwa);
    window.addEventListener('appinstalled', onPwaInstalled);
  }
};
