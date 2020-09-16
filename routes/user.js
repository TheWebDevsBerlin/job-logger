const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');
// const { render } = require('../app');
const Job = require('../models/Job');
const {
  find
} = require('../models/User');

const googleMapsApi = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&callback=initMap&libraries=places&v=weekly`;

router.get('/dashboard', (req, res, next) => {
  if (!req.session.user) res.redirect('/login');

  User.findOne({
      _id: req.session.user._id
    })
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

router.get('/job/add/:title/:company', (req, res, next) => {
  if (!req.session.user) res.redirect('/login');
  const {
    title,
    company
  } = req.params;

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
          slug
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
    `
      }
    })
    .then(result => {
      const data = result.data.data.job;
      const job = new Job ; 
      job.job.id = {
          slug: data.slug,
          companySlug: data.company.slug
        };
      job.job.data = data;
      

      Job.findOne({
        slug: data.slug,
        companySlug: data.company.slug
      })
        .then(job_result => {
          if (!job_result) {
            job.save()
            .then(dbJob => {
              console.log({dbJob});
              User.findOne({
                _id: req.session.user._id
              })
              .then(user => {
                console.log({user});
                user.jobs.push(dbJob._id)
                user.save()
                .then(dbUser=>console.log({dbUser}))
                .catch(err=>next(err));
              })
              .catch(err=>next(err))
            })
            .catch(err=>next(err));
          } else {
            User.findOne({
              _id: req.session.user._id
            })
            .then(user => {
              user.jobs.push(dbJob._id)
            })
            .catch(err=>next(err))
          }
        });
    });

});



module.exports = router;