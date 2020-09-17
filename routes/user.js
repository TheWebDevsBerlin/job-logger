const express = require('express');
const router = express.Router();
const axios = require('axios');
const {searchByID} = require('../queries');
const Job = require('../models/Job');
const User = require('../models/User');

router.get('/dashboard', (req, res, next) => {
  if (!req.session.user) res.redirect('/login');

  User.findOne({
      _id: req.session.user._id
    })
    .populate("jobs")
    .then(user => {
      console.log(user.jobs[0]);
      res.render('user/dashboard', {
          jobs: user.jobs,
          user: req.session.user,
          dashboard: true
        })
        .catch(err => next(err));
    });

});

router.post('/job/add/:title/:company', (req, res, next) => {
  if (!req.session.user) res.redirect('/login');
  const {
    title,
    company
  } = req.params;

  axios({
    url: 'https://api.graphql.jobs/',
    method: 'POST',
    data: {
      query: searchByID(company,title)
    }
  })
  .then(result => {
    // result is response from API
    const data = result.data.data.job;
    const job = {
      id: {
        slug: data.slug,
        companySlug: data.company.slug
      },
      data: data
    }; 
    
    Job.findOne({
      slug: data.slug,
      companySlug: data.company.slug
    })
      .then(job_result => {
        if (!job_result) {
          Job.create({job: job})
          .then(dbJob => {
            User.findOne({
              _id: req.session.user._id
            })
            .then(user => {
              user.jobs.push(dbJob._id);
              user.save()
              .then(()=>{
                res.sendStatus(200);
              })
              .catch(err=>next(err));
            })
            .catch(err=>next(err));
          })
          .catch(err=>next(err));
        } else {
          User.findOne({
            _id: req.session.user._id
          })
          .then(user => {
            user.jobs.push(dbJob._id);
            res.sendStatus(200);
          })
          .catch(err=>next(err));
        }
      });
  });
});

module.exports = router;