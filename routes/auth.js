const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');


router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/login', (req, res) => {
  res.render('auth/login', {
    message: req.flash('error')
  });
});

router.post('/signup', (req, res) => {
  const {
    username,
    password
  } = req.body;

  if (password.length < 8) {
    res.render('auth/signup', {
      errorMessage: 'Your password must be a minimum of 8 characters'
    });
    return;
  }
  if (username === '') {
    res.render('auth/signup', {
      errorMessage: 'Your username cannot be empty'
    });
    return;
  }
  User.findOne({
      username: username
    })
    .then(found => {
      if (found !== null) {
        res.render('auth/signup', {
          errorMessage: 'This username is already taken'
        });
      } else {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);

        User.create({
            username: username,
            password: hash
          })
          .then(dbUser => {
            console.log(dbUser);
            // req.login();
            res.render('auth/login', {
              user: dbUser
            });
          })
      }
    })
})

router.get('/edit', (req, res) => {
  const {
    username,
    _id
  } = req.user;
  console.log(username, _id);
  User.findById(_id)
    .then(userFromDB => {
      res.render('auth/edit', {
        name: userFromDB
      })
    })
    .catch(error => {
      next(error);
    })
});

router.post(
  "/user/edit", (req, res) => {
    console.log("this is the request", req.body, req.user)
    const {
      username
    } = req.body;
    User.findByIdAndUpdate(req.user._id, {
        username
      })

      .then(user => {
        res.redirect(`/`);
      })
      .catch(err => {
        next(err);
      });
  }
);

router.get('/delete/', (req, res) => {
  const id = req.user._id;
  User.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/');
      console.log(req.body);
    })
    .catch(error => {
      console.log(error);
    })
});


router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
}));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;