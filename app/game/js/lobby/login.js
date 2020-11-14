const logUserNameBtn = document.getElementById('logBtn');
const logPasswordBtn = document.getElementById('passBtn');

export default {
  init: (socket) => {

    // // testing
    // sendUsername.call({ socket }, "q");
    // socket.on("askPass", () => {
    //   socket.emit("password", "q");
    // });
    // /////////////////////////

    const context = { socket };
    logUserNameBtn.addEventListener('click', checkUsername.bind(context));
  },

  end: () => {
    window.history.pushState({
      "pageTitle": "test"
    }, "", "/jouer");

    window.addEventListener('popstate', function() {
      window.location.replace("../")
    }, false);

    hide(document.getElementById('lobby'));
  }
};

const checkUsername = function() {
  const userName = document.getElementById("userName")
    .value;
  !userName.length ? alertCantBeNull() :
    userName.length > 15 ? alertUserCantBeLong() :
    sendUsername.call(this, userName);
};

const sendUsername = function(userName) {
  const { socket } = this;
  socket.emit("username", userName);
  const context = { socket, userName };
  socket.on("askPass", askPass.bind(context));
}

const askPass = function(nameIsAvailable) {
  hideUsernameBox();
  showPasswordBox();
  logPasswordBtn.addEventListener('click', sendPassword.bind(this));
  nameIsAvailable && showConfirmPasswordBox();
};

const hideUsernameBox = () => {
  const userNameBox = document.getElementById("user");
  logUserNameBtn.style.display = userNameBox.style.display = "none";
};

const showPasswordBox = () => {
  const passwordBox = document.getElementById("pass");
  logPasswordBtn.style.display = passwordBox.style.display = "block";
};

const showConfirmPasswordBox = () => {
  const passwordConfirmBox = document.getElementById("pass2");
  document.getElementById('passtxt')
    .innerHTML = "Créer un mot de passe";
  passwordConfirmBox.style.display = "block";
};

const sendPassword = function() {
  const { socket, nameIsAvailable } = this;
  const passwordInput = document.getElementById("Password");
  const confirmInput = document.getElementById("Password2");
  const password = passwordInput.value;
  const confirmation = nameIsAvailable ? confirmInput.value : password;

  password !== confirmation ? alertCantBeDiff() :
    !password.length ? alertCantBeNull() :
    password.length > 20 ? alertPassCantBeLong() :
    socket.emit("password", password);
};

const alertCantBeNull = () =>
  alert("Le nom d'utilisateur ne peut pas être nul !");

const alertUserCantBeLong = () =>
  alert("Le nom d'utilisateur ne doit pas contenir plus de 15 caractères !");

const alertPassCantBeLong = () =>
  alert("Le mot de passe ne doit pas contenir plus de 20 caractères !");

const alertCantBeDiff = () =>
  alert("Les deux mots de passe ne sont pas identiques !");

const hide = e => {
  e.style.opacity = "0";
  setTimeout(() => e.style.display = "none", 300);
};
