const express = require('express');
const router = express.Router();
const ejsLint = require('ejs-lint');

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
router.get('/game', function(request, response) {
  response.render("client-game");
});

router.use('/semantic', express.static('public/semantic'));
router.use('/static', express.static('public/static'));
router.use('/img', express.static('public/img'));

module.exports = router;
