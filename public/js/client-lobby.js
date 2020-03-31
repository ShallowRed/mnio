var socket = io();
var login = document.getElementById('login');

// Send a username and a password to server
login.addEventListener('click', function() {
  socket.emit("login", {
    user: document.getElementById("userName").value,
    pass: document.getElementById("Password").value
  });
});

socket.on("message", function(data) {
  console.log(data);
});

socket.on("alert", function(data) {
  alert(data);
});

socket.on("error", function() {
  alert("Error: Please try again!");
});
