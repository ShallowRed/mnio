const express = require('express');
const router = express.Router();
const path = require('path');
let adminflag = false;

router.use(express.urlencoded());
router.use(express.json());

// Routes to game

router.use('/dist', express.static('dist'));
router.use('/admin', express.static('admin'));
router.get("/", function(request, response) {
  response.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Routes to admin

router.get("/admin", function(request, response) {
  response.sendFile(path.join(__dirname, '../../admin/admin-log.html'));
});
router.post('/adminlog', function(request, response) {
  if (request.body.user.password == "a") adminflag = true;
})
router.get("/adminpage", function(request, response) {
  if (adminflag) {
    response.sendFile(path.join(__dirname, '../../admin/admin-page.html'));
    adminflag = false;
  } else response.sendFile(path.join(__dirname, '../../admin/admin-log.html'));
});

module.exports = router;
