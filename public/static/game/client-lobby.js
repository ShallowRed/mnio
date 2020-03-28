var socket = io();
var login = document.getElementById('login');
var logwindow = document.getElementById('logwindow');

// Send a username and a password to server
login.addEventListener('click', function() {
  socket.emit("login", {
    user: document.getElementById("userName").value,
    pass: document.getElementById("Password").value
  });
});

// Hide loggin window when server agreed for connection
socket.on("logged_in", function() {
  console.log("logged in !");
  logwindow.style.display = "none";
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
