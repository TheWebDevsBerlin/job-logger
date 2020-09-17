const express = require('express');
const router = express.Router();
const User = require('../models/User');

const bcrypt = require('bcrypt');


router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/login', (req, res) => {
  res.render('auth/login', {
  });
});

router.post('/signup', (req, res) => {
  const {
    username,
    password,
    firstName,
    surName,
    street,
    city,
    zip
  } = req.body;

  if (password.length < 8) {
    res.render('auth/signup', {
      message: 'Your password must be a minimum of 8 characters'
    });
    return;
  }
  if (username === '') {
    res.render('auth/signup', {
      message: 'Your username cannot be empty'
    });
    return;
  }
  if (firstName === '') {
    res.render('auth/signup', {
      message: 'You must have a name?'
    });
    return;
  }
  if (surName === '') {
    res.render('auth/signup', {
      message: 'You must have a surname?'
    });
    return;
  }

  User.findOne({
      username: username
    })
    .then(found => {
      if (found !== null) {
        res.render('auth/signup', {
          message: 'This username is already taken'
        });
      } else {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);

        User.create({
            username,
            password: hash,
            firstName,
            surName,
            street,
            city,
            zip,
            jobs: []
          })
          .then((dbUser) => {
            req.session.user = dbUser;
            res.redirect('/');
          });
      }
    });
});

router.get('/edit', (req, res) => {
  const {
    username,
    _id
  } = req.user;
  User.findById(_id)
    .then(userFromDB => {
      res.render('auth/edit', {
        name: userFromDB
      });
    })
    .catch(error => {
      next(error);
    });
});


router.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/login", {
      message: "Please enter both a username and  a password to sign in.",
    });
    return;
  }

  User.findOne({ username : username })
    .then((user) => {
      if (!user) {
        res.render('auth/login', {
          message: "The username doesn't exist.",
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect('/');
      } else {
        res.render("auth/login", {
          message: "Incorrect password",
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
