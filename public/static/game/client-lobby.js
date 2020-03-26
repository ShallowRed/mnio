var socket = io();

var lgr = document.getElementById('Login_Register');
var logwindow1 = document.getElementById('n_log_in');
var logwindow2 = document.getElementById('log_in');

// Send a username and a password to server
lgr.addEventListener('click', function() {
  socket.emit("login_register", {
    user: document.getElementById("userName").value,
    pass: document.getElementById("Password").value
  });
});

// Hide loggin window when server agreed for connection
socket.on("logged_in", function() {
  console.log("logged in !");
  logwindow1.style.display = "none";
});

socket.on("alert", function(data) {
  alert(data);
});

socket.on("error", function() {
  alert("Error: Please try again!");
});
