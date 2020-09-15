const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/dashboard', (req,res,next) => {
  if(!req.session.user) res.redirect('/login');

  User.findOne({_id: req.session.user._id})
    .then(user => {
      res.render('user/dashboard', {
        jobs: user.jobs,
        user: req.session.user,
        dashboard: true
    })
    .catch(err => next(err));
  });

});

module.exports = router;