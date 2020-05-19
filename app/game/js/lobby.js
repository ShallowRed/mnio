(function() {
  const title = document.getElementById('logofull');
  const container = document.getElementById('container');
  const iosMessage = document.getElementById('iosMessage');
  const installMessage = document.getElementById('installMessage');
  const installedMessage = document.getElementById('installedMessage');
  const installBtn = document.getElementById('installBtn');
  const stayInBrowser = document.getElementById('stayBtn');
  const logWindow = document.getElementById('logWindow');
  const logBtn = document.getElementById('logBtn');
  const https = document.getElementById('https');
  const forgot = document.getElementById('forgot');
  const lejeu = document.getElementById('jeu');
  const lagalerie = document.getElementById('galerie');
  const welcomeMsg = document.getElementById('welcomeMsg');

  const show = (elem) => elem.style.display = 'block';
  const hide = (elem) => elem.style.display = 'none';

  lejeu.addEventListener("click", () => {
    hide(lejeu);
    hide(welcomeMsg);
    hide(lagalerie);
    show(container);
  });

  const isonPwa = () =>
    (window.matchMedia('(display-mode: standalone)').matches) ||
    (window.navigator.standalone) ||
    document.referrer.includes('android-app://');

  window.addEventListener("load", () => {
    title.style.opacity = "1";
    container.style.opacity = "1";
  });

  forgot.addEventListener("click", () => {
    alert("Nous ne pouvons pas encore automatiser la gestion des mots de passe. Cependant vous pouvez écrire un mail à lucaspoulain2@gmail.com pour obtenir votre mot de passe")
  });

  window.addEventListener('beforeinstallprompt', () => {
    window.deferredPrompt = event;
    hide(logWindow);
    hide(logBtn);
    show(installMessage);
    show(installBtn);
    show(stayInBrowser);
  });

  if (['iPhone', 'iPad', 'iPod'].includes(navigator.platform) &&
    !navigator.standalone) {
    show(installMessage);
    show(iosMessage);
    show(stayInBrowser);
    hide(logWindow);
    hide(logBtn);
  }

  installBtn.addEventListener('click', () => {
    hide(installMessage);
    hide(installBtn);
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) return;
    promptEvent.prompt();
    promptEvent.userChoice.then((result) => {
      console.log('userChoice', result);
      window.deferredPrompt = null;
    });
  });

  stayInBrowser.addEventListener('click', () => {
    hide(installMessage);
    hide(installBtn);
    hide(stayInBrowser);
    hide(iosMessage);
    show(logWindow);
    show(logBtn);
  });

  document.getElementById('logo').addEventListener("click", () => window.location.reload(true));
  document.getElementById('refresh').addEventListener("click", () => window.location.reload(true));

  window.addEventListener('appinstalled', () => {
    show(installedMessage);
    let count = 0;
    setInterval(() => {
      if (isonPwa()) window.location.reload(true);
      else count++;
      if (count == 40) window.location.reload(true);
    }, 200)
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/dist/service-worker.js', {
          scope: '/'
        })
        .then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

  if (window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1" &&
    window.location.protocol === 'http:') {
    https.querySelector('a').href = window.location.href.replace('http://', 'https://');
    show(https);
  }
}());
