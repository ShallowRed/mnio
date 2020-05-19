const LOG = {

  box: {
    user: document.getElementById("user"),
    pass: document.getElementById("pass"),
    pass2: document.getElementById("pass2")
  },

  input: {
    user: document.getElementById("userName"),
    pass: document.getElementById("Password"),
    pass2: document.getElementById("Password2")
  },

  btn: {
    user: document.getElementById('logBtn'),
    pass: document.getElementById('passBtn')
  },
};

LOG.send = {
  username: () => {
    LOG.username = LOG.input.user.value;
    if (!LOG.username.length) alert("Le nom d'utilisateur ne peut pas être nul !")
    else LOG.socket.emit("username", LOG.username);
  },

  password: () => {
    const pass = LOG.input.pass.value;
    const pass2 = LOG.isNew ? LOG.input.pass2.value : pass;
    if (pass !== pass2) alert("Les deux mots de passe ne sont pas identiques !")
    else if (!pass.length) alert("Le mot de passe ne peut pas être nul !")
    else if (pass.length > 16) alert("Le mot de passe ne doit pas contenir plus de 16 caractères !")
    else LOG.socket.emit("password", [LOG.username, pass]);
  }
};

LOG.askPass = isNew => {
  LOG.isNew = isNew;
  LOG.btn.user.style.display = LOG.box.user.style.display = "none";
  LOG.btn.pass.style.display = LOG.box.pass.style.display = "block";
  if (isNew) {
    document.getElementById('passtxt').innerHTML = "Créer un mot de passe";
    LOG.box.pass2.style.display = "block";
  };
};

const login = (socket) => {
  LOG.socket = socket;
  LOG.btn.user.addEventListener('click', () => LOG.send.username());
  LOG.btn.pass.addEventListener('click', () => LOG.send.password());
  socket.on("askPass", isNew => LOG.askPass(isNew))
};

export default login
