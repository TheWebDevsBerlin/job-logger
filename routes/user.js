const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/dashboard', (req,res,next) => {
  if(!req.user) res.redirect('/login');

  User.findOne({_id: req.user._id})
    .then(user => {
      res.render('user/dashboard', {
        jobs: user.jobs
    })
    .catch(err => next(err));
  });

});

module.exports = router;