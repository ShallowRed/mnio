const express = require('express');
const router = express.Router();
const path = require('path');
let adminflag = false;

router.use(express.urlencoded());
router.use(express.json());

const options = {
  setHeaders: function(res, path, stat) {
    res.set('Service-Worker-Allowed', '/');
  }
}

// Routes to game
router.use('/dist', express.static(path.join(process.cwd(), './dist'), options));
router.get("/", (req, res) => res.sendFile(path.join(__dirname, '../../dist/index.html')));

// Routes to gallerytator
router.get("/gallery", (req, res) => res.sendFile(path.join(__dirname, '../../dist/gallery/gallery.html')));

// Routes to admin
router.use('/admin', express.static('admin'));
router.get("/admin", (req, res) => res.sendFile(path.join(__dirname, '../../admin/admin-log.html')));
router.post('/adminlog', (req, res) => {
  if (req.body.user.password == "a") adminflag = true;
})
router.get("/adminpage", (req, res) => {
  if (adminflag) {
    res.sendFile(path.join(__dirname, '../../admin/admin-page.html'));
    adminflag = false;
  } else res.sendFile(path.join(__dirname, '../../admin/admin-log.html'));
});

module.exports = router;
