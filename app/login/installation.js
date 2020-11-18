const container = document.getElementById('container');
const iosMessage = document.getElementById('iosMessage');
const installMessage = document.getElementById('installMessage');
const installBtn = document.getElementById('installBtn');
const stayInBrowserBtn = document.getElementById('stayBtn');
const logWindow = document.getElementById('logWindow');
const logBtn = document.getElementById('logBtn');

const show = (elem) => elem.style.display = 'block';
const hide = (elem) => elem.style.display = 'none';

export default () => {
  checkHttps();
  initListeners();
  registerServiceWorker();
  appleDevicesInstall();
  initPwa();
};

const initListeners = () => {
  const lejeu = document.getElementById('jeu');
  const welcomeMsg = document.getElementById('welcomeMsg');
  const lagalerie = document.getElementById('galerie');
  const forgot = document.getElementById('forgot');

  lejeu.addEventListener("click", () => {
    hide(lejeu);
    hide(welcomeMsg);
    hide(lagalerie);
    show(container);
  });

  stayInBrowserBtn.addEventListener('click', stayInBrowser);

  document.getElementById('logo')
    .addEventListener("click", () =>
      window.location.reload(true)
    );

  // document.getElementById('refresh')
  //   .addEventListener("click", () =>
  //     window.location.reload(true)
  //   );

  window.addEventListener("load", () => {
    const title = document.getElementById('logofull');
    title.style.opacity = "1";
    container.style.opacity = "1";
  });

  forgot.addEventListener("click", () => {
    alert(
      "Nous ne pouvons pas encore automatiser la gestion des mots de passe. Cependant vous pouvez écrire un mail à lucaspoulain2@gmail.com pour obtenir votre mot de passe"
    )
  });
};

const stayInBrowser = () => {
  hide(installMessage);
  hide(installBtn);
  hide(stayInBrowser);
  hide(iosMessage);
  show(logWindow);
  show(logBtn);
};

const isonPwa = () => {
  return (window.matchMedia('(display-mode: standalone)')
      .matches) ||
    (window.navigator.standalone) ||
    document.referrer.includes('android-app://');
};

const beforeinstallprompt = () => {
  hide(logWindow);
  hide(logBtn);
  show(installMessage);
  show(installBtn);
  show(stayInBrowserBtn);
};

const installPwa = () => {
  hide(installMessage);
  hide(installBtn);
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) return;
  promptEvent.prompt();
  promptEvent.userChoice.then((result) => {
    console.log('userChoice', result);
    window.deferredPrompt = null;
  });
};

const onAppInstalled = () => {
  const installedMessage = document.getElementById('installedMessage');
  show(installedMessage);
  let count = 0;
  setInterval(() => {
    if (isonPwa())
      window.location.reload(true);
    else
      count++;
    if (count == 40)
      window.location.reload(true);
  }, 200)
}

const initPwa = () => {

  window.addEventListener('beforeinstallprompt', () => {
    window.deferredPrompt = event;
    beforeinstallprompt()
  });

  installBtn.addEventListener('click', installPwa());

  window.addEventListener('appinstalled', onAppInstalled);
};

const appleDevicesInstall = () => {
  if (['iPhone', 'iPad', 'iPod'].includes(navigator.platform) &&
    !navigator.standalone) {
    show(installMessage);
    show(iosMessage);
    show(stayInBrowserBtn);
    hide(logWindow);
    hide(logBtn);
  }
};

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/dist/service-worker.js', {
          scope: '/'
        })
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

const checkHttps = () => {
  const https = document.getElementById('https');

  if (window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1" &&
    window.location.protocol === 'http:') {
    https.querySelector('a')
      .href = window.location.href.replace('http://', 'https://');
    show(https);
  }
};
