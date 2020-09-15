const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const Job = require('../models/Job');


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
console.log('ADD JOB!');
  const {title, company} = req.params;

  axios({
    url: 'https://api.graphql.jobs/',
    method: 'POST',
    data: {
      query: `
        query job {job(input:{
            jobSlug:"${title}"
            companySlug:"${company}"
          }){
            title
            commitment{
              title
              slug
              createdAt
              updatedAt
            }
            cities{
              id
              name
              slug
              country{id}
              type
              jobs{id}
              createdAt
              updatedAt
            }
            countries{
              id
              name
              slug
              type
              isoCode
              cities{id}
              jobs{id}
              createdAt
              updatedAt
            }
            remotes{
              id
              name
              slug
              type
              jobs{id}
              createdAt
              updatedAt
            }
            applyUrl
            company{
              id
              name
              slug
              websiteUrl
              logoUrl
              jobs{id}
              twitter
              emailed
              createdAt
              updatedAt
            }
            tags{
              id
              name
              slug
              jobs{id}
              createdAt
              updatedAt
            }
            isPublished
            userEmail
            postedAt
            createdAt
            updatedAt
            description
            locationNames
          }}
    `}
  })
  .then(result => {
    
  });

  User.findOneAndUpdate({_id: req.session.user._id})
    .populate('jobs')
    .then(user => {
      axios({})
        .then()
        .catch(err => next(err));

      console.log(user);
      res.render('user/dashboard', {
        jobs: user.jobs,
        user: req.session.user,
        dashboard: true
    })
    .catch(err => next(err));
  });
});

module.exports = router;