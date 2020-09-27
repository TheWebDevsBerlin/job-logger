const express = require('express');
const router = express.Router();
const axios = require('axios');
const {searchByID} = require('../queries');
const Job = require('../models/Job');
const User = require('../models/User');
const {showQuote} = require('./middleware');

router.get('/dashboard', (req, res, next) => {
  if (!req.session.user) res.redirect('/login');

  User.findOne({
      _id: req.session.user._id
    })
    .populate("jobs")
    .then(user => {
      for(let job of user.jobs) {
        job.job.data.logoUrl = job.job.data.company.websiteUrl
          .slice(job.job.data.company.websiteUrl.indexOf('//')+2);
      }

      res.render('user/dashboard', {
        jobs: user.jobs,
        id: user._id,
        user: req.session.user,
        dashboard: true,
        showQuote
      });
    })
    .catch(err => next(err));
});

router.post('/dashboard/statusUpdate/:jobId/:statusValue', (req, res, next) => {
  if(req.session.user) {
    const {jobId, statusValue} = req.params;

    User.findById(req.session.user._id, (err, user) => {
      if(err) res.sendStatus(err);
      if(!user.status) user.status = {};
      user.status = {...user.status, [jobId]: +statusValue};

      user.save(()=>res.sendStatus(200));

    });
  }
});

router.get('/dashboard/statusImport', (req, res, next) => {
  if(req.session.user) {

    User.findById(req.session.user._id, (err, user) => {
      if(err) res.sendStatus(err);
      if(user.status) res.send(user.status);
    });
  }
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


router.post('/job/remove/:title/:company/:id?', (req, res, next) => {
  if (!req.session.user) res.redirect('/login');
  const {id} = req.params;

  Job.deleteOne({_id: id}).then((jobResponse)=>{
    User.findOne({_id: req.session.user})
    .populate('jobs')
    .then(user => {
      if(user.status) {
        delete user.status['id-'+id];
        newStatus = {...user.status};
      }
      if(user.jobs){
        newJobs = [...user.jobs].filter(i => i._id.toString() !== id);
      }
      User.findByIdAndUpdate(req.session.user, {jobs: newJobs, status: newStatus}, (userResponse)=>{
        res.sendStatus(200);
      });
    })
    .catch(err=>console.log(err));
  })
  .catch(err=>console.log(err));
});

module.exports = router;