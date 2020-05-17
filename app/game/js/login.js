const log = {
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
  }
}

const login = socket => {
  log.btn.user.addEventListener('click', () => {
    log.username = log.input.user.value;
    if (!log.username.length) alert("Le nom d'utilisateur ne peut pas être nul !")
    else socket.emit("username", log.username);
    socket.on("askPass", isNew => askPass(isNew, socket))
  });
}

const askPass = (isNew, socket) => {

  log.btn.pass.addEventListener('click', () => {
    const pass = log.input.pass.value;
    const pass2 = isNew ? log.input.pass2.value : pass;
    if (pass !== pass2) alert("Les deux mots de passe ne sont pas identiques !")
    else if (!pass.length) alert("Le mot de passe ne peut pas être nul !")
    else if (pass.length > 16) alert("Le mot de passe ne doit pas contenir plus de 16 caractères !")
    else socket.emit("password", [log.username, pass]);
  })

  log.btn.user.style.display = log.box.user.style.display = "none";
  log.btn.pass.style.display = log.box.pass.style.display = "block";
  if (isNew) {
    document.getElementById('passtxt').innerHTML = "Créer un mot de passe";
    log.box.pass2.style.display = "block";
  };
}

export default login
