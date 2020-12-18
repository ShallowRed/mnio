const logUserNameBtn = document.querySelector('.log-username-btn');
const logPasswordBtn = document.querySelector('.log-password-btn');

export default function listenLogin(socket) {

  logUserNameBtn.addEventListener('click', () => {
    checkUsername(socket);
  });

  document.querySelector('.forgot')
    .addEventListener("click", () => {
      alert("(Fonctionnalité en construction, désolé)");
    });
}

const checkUsername = (socket) => {
  const userName = document.querySelector(".login-username input")
    .value;
  !userName.length ? alertCantBeNull() :
    userName.length > 15 ? alertUserCantBeLong() :
    sendUsername(socket, userName);
};

const sendUsername = (socket, userName) => {
  socket.emit("username", userName);
  socket.on("askPass", nameIsAvailable => {
    askForPassword(socket, userName, nameIsAvailable)
  });
}

const askForPassword = (socket, userName, nameIsAvailable) => {
  hideUsernameBox();
  showPasswordBox();
  nameIsAvailable && showConfirmPasswordBox();
  logPasswordBtn.addEventListener('click', () => {
    sendPassword(socket, nameIsAvailable);
  });
  socket.on('wrongPass', alertWrongPass);
};

const sendPassword = (socket, nameIsAvailable) => {
  const passwordInput = document.querySelector(".login-password input");
  const confirmInput = document.querySelector(".login-confirmation input");
  const password = passwordInput.value;
  const confirmation = nameIsAvailable ? confirmInput.value : password;

  password !== confirmation ? alertCantBeDiff() :
    !password.length ? alertCantBeNull() :
    password.length > 20 ? alertPassCantBeLong() :
    socket.emit("password", password);
};

const hideUsernameBox = () => {
  const userNameBox = document.querySelector(".login-username");
  logUserNameBtn.style.display = userNameBox.style.display = "none";
};

const showPasswordBox = () => {
  const passwordBox = document.querySelector(".login-password");
  logPasswordBtn.style.display = passwordBox.style.display = "block";
};

const showConfirmPasswordBox = () => {
  const passwordConfirmBox = document.querySelector(".login-confirmation");
  document.querySelector('.login-password h4')
    .innerHTML = "Créer un mot de passe";
  passwordConfirmBox.style.display = "block";
};

const alertCantBeNull = () =>
  alert("Le nom d'utilisateur ne peut pas être nul !");

const alertUserCantBeLong = () =>
  alert("Le nom d'utilisateur ne doit pas contenir plus de 15 caractères !");

const alertPassCantBeLong = () =>
  alert("Le mot de passe ne doit pas contenir plus de 20 caractères !");

const alertCantBeDiff = () =>
  alert("Les deux mots de passe ne sont pas identiques !");

const alertWrongPass = () =>
  alert("Mot de passe incorrect pour ce nom d'utilisateur");
