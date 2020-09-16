const express = require('express');
const router = express.Router();
const axios = require('axios');
const {searchByID} = require('../queries');

const User = require('../models/User');

router.get('/dashboard', (req,res,next) => {
  if(!req.session.user) res.redirect('/login');

  User.findOne({_id: req.session.user._id})
    .then(user => {
      console.log(user);
      res.render('user/dashboard', {
        jobs: user.jobs,
        user: req.session.user,
        dashboard: true
    })
    .catch(err => next(err));
  });
});

router.get('/job/add/:title/:company', (req,res,next) => {
  if(!req.session.user) res.redirect('/login');
  const {title, company} = req.params;

  axios({
    url: 'https://api.graphql.jobs/',
    method: 'POST',
    data: {
      query: searchByID(company,title)
    }
  })
  .then(result => {
    const data = result.data.data.job;

    console.log({result: data});
    User.findByIdAndUpdate({_id: req.session.user._id})
      .populate('jobs')
      .then(user => {
        console.log({
          id: {
            slug: data.slug,
            company: data.company.slug
          },
          data: {
            ...data
          }
        });
        if(!user.jobs) user.jobs = [];
        user.jobs.push(1);
        res.render('user/dashboard', {
          jobs: user.jobs.data
        })
        .catch(err => next(err));
      });
    });
});

module.exports = router;