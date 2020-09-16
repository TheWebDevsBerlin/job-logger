const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');
// const { render } = require('../app');
// const Job = require('../models/Job');

const googleMapsApi = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&callback=initMap&libraries=places&v=weekly`;

router.get('/dashboard', (req,res,next) => {
  if(!req.session.user) res.redirect('/login');

  User.findOne({_id: req.session.user._id})
    .populate('jobs')
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
      query: `
        query {
          job(input:{
            jobSlug:"${title}"
            companySlug:"${company}"
          }) {
          title
          commitment {
            title
            slug
          }
          cities {
            name
            slug
            type
          }
          countries {
            name
            slug
            type
            isoCode
          }
          remotes {
            name
            slug
            type
          }
          applyUrl
          company {
            name
            slug
            websiteUrl
            logoUrl
            twitter
            emailed
          }
          tags {
            name
            slug
          }
          isPublished
          userEmail
          postedAt
          createdAt
          updatedAt
          description
          locationNames
        }
      }
    `}
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