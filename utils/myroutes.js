var express = require('express');
var router = express.Router();

//Routes to pages
router.get("/", function(request, response) {
  response.render("pages/accueil");
});
router.get("/accueil", function(request, response) {
  response.render("pages/accueil");
});
router.get("/welcome", function(request, response) {
  response.render("pages/welcome");
});
router.get("/res", function(request, response) {
  response.render("pages/res");
});
router.get("/tel", function(request, response) {
  response.render("pages/tel");
});
router.get("/ap", function(request, response) {
  response.render("pages/ap");
});
router.get('/game2', function(request, response) {
  response.render("pages/game2");
});

module.exports = router;
