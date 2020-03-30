const volet2 = document.getElementById("volet2");
window.onload = function() {
  volet2.style.opacity = "0";
  setTimeout(function() {
    volet2.style.display = "none"
  }, 400);
}
