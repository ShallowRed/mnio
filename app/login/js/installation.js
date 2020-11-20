import { hide, show } from './utils';

const installPwa = () => {
  const installMessage = document.querySelector('.message-install');
  hide(installMessage);
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) return;
  promptEvent.prompt();
  promptEvent.userChoice.then((result) => {
    console.log('userChoice', result);
    window.deferredPrompt = null;
  });
};

const onPwaInstalled = (count = 0) => {
  const installedMessage = document.querySelector('.message-installed');
  show(installedMessage);
  setInterval(() => {
    if (count > 40 || isonPwa())
      window.location.reload(true);
    else count++;
  }, 200)
};

const isonPwa = () =>
  window.matchMedia('(display-mode: standalone)')
  .matches ||
  window.navigator.standalone ||
  document.referrer.includes('android-app://')

export { installPwa, onPwaInstalled };
