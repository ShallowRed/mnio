const express = require('express');
const router = express.Router();
const ejsLint = require('ejs-lint');
let adminflag = false;

router.use(express.urlencoded());
router.use(express.json());

// Routes to game

// router.use('/img', express.static('public/img'));
router.use('/public', express.static('public'));
router.use('/admin', express.static('admin'));
router.get("/", function(request, response) {
  response.render("index");
});

// Routes to admin

router.get("/admin", function(request, response) {
  response.render("../admin/admin-log");
});

router.post('/adminlog', function(request, response) {
  if (request.body.user.password == "a") adminflag = true;
})

router.get("/adminpage", function(request, response) {
  if (adminflag == true) {
    response.render("../admin/admin-page");
    adminflag = false;
  } else response.render("../admin/admin-log");
});

module.exports = router;
