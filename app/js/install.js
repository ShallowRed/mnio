const divInstall = document.getElementById('installContainer');
const butInstall = document.getElementById('butInstall');

window.addEventListener('beforeinstallprompt', (event) => {
  console.log('beforeinstallprompt ok');
  window.deferredPrompt = event;
  divInstall.style.display = "block";
});

butInstall.addEventListener('click', () => {
  console.log('butInstall-clicked');
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) return;
  promptEvent.prompt();

  promptEvent.userChoice.then((result) => {
    console.log('userChoice', result);
    window.deferredPrompt = null;
    divInstall.style.display = "none";
  });
});

window.addEventListener('appinstalled', (event) => {
  divInstall.style.display = "none";
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/dist/service-worker.js', { scope: '/' })
    // navigator.serviceWorker.register('/dist/service-worker.js', { scope: '/dist/' })
    .then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

if (window.location.protocol === 'http:') {
  const requireHTTPS = document.getElementById('requireHTTPS');
  const link = requireHTTPS.querySelector('a');
  link.href = window.location.href.replace('http://', 'https://');
  requireHTTPS.style.display = 'block';
}
