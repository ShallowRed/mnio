const express = require('express');
const router = express.Router();
const ejsLint = require('ejs-lint');
let adminflag = false;
//get requests properly
router.use(express.urlencoded());
router.use(express.json());

//Routes to pages
router.get("/", function(request, response) {
  response.render("client-game");
});

router.get("/admin", function(request, response) {
  response.render("../admin/admin-log");
});

router.post('/adminlog', function(request, response) {
  if (request.body.user.password == "a") adminflag = true;
  // if (request.body.user.password == "Lucastom2!") adminflag = true;
})

router.get("/adminpage", function(request, response) {
  if (adminflag==true) {
    response.render("../admin/admin-page");
    adminflag = false;
  } else response.render("../admin/admin-log");
});

router.use('/css', express.static('public/css'));
router.use('/js', express.static('public/js'));
router.use('/img', express.static('public/img'));
router.use('/admin', express.static('admin'));

module.exports = router;
