const express = require('express');
const router = express.Router();
const ejsLint = require('ejs-lint');

//Routes to pages
router.get("/", function(request, response) {
  response.render("client-game");
});

router.use('/css', express.static('public/css'));
router.use('/js', express.static('public/js'));
router.use('/img', express.static('public/img'));

module.exports = router;
