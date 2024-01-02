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

// router.post('/upload', isLoggedIn, upload.single("file"), async function (req, res) {
//   if (!req.file) {
//     return res.status(400).send("No Files were uploaded!");
//   };
//   const user = await userModel.findOne({ username: req.session.passport.user });
//   const postData = await postModel.create({
//     image: req.file.filename,
//     imgText: req.body.fileCaption,
//     user: user._id
//   });
//   user.post.push(postData._id);
//   await user.save();
//   res.send("done!");
// });
router.post('/upload', isLoggedIn, upload.single("file"), async function (req, res) {
  if (!req.file) {
    return res.status(400).send("No Files were uploaded!");
  }

  try {
    const user = await userModel.findOne({ username: req.session.passport.user });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const postData = await postModel.create({
      image: req.file.filename,
      imgText: req.body.fileCaption,
      user: user._id
    });

    if (!user.post) {
      user.post = []; // Initialize user.post as an empty array if it doesn't exist
    }

    user.post.push(postData._id);
    await user.save();
    res.send("Uploading Successful!!");
  } catch (error) {
    console.error("Error uploading:", error);
    res.status(500).send("Error uploading");
  }
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
