var express = require('express');
var router = express.Router();
const userModel = require("./users")
const postModel = require("./post");
const passport = require('passport');
const localStrategy = require("passport-local");
const upload = require('./multer');

passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/upload', isLoggedIn, upload.single("file"), async function (req, res) {
  if (!req.file) {
    return res.status(400).send("No Files were uploaded!");
  };
  const user = await userModel.findOne({ username: req.session.passport.user });
  const postData = await postModel.create({
    image: req.file.filename,
    imgText: req.body.fileCaption,
    user: user._id
  });
  user.posts.push(postData._id);
  await user.save();
  res.redirect("/profile");
});

router.get('/login', function (req, res, next) {
  res.render('login', { error: req.flash("error") });
});

router.get('/feed', function (req, res, next) {
  res.render('feed');
});
router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
    .populate("posts")
  res.render('profile', { user });
});

router.post("/register", function (req, res) {
  const { username, email, fullName } = req.body;
  const userData = new userModel({ username, email, fullName });

  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      });
    });
});


router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}), function (req, res) {

});

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}


module.exports = router;
