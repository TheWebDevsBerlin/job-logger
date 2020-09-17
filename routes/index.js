const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const Job = require('../models/Job');

const {allJobs, searchByLocation} = require('../queries');

const googleMapsApi = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&callback=initMap&libraries=places&v=weekly`;

function applyFilter(userId, data) {
  User.findById(userId)
  .populate('job')
  .then(dbUser=>{
    
    data.jobs.forEach(APIJob => {
      dbUser.jobs.forEach(jobId => {
      Job.findById(jobId)
      .then(dbJob=>{
        if(
          APIJob.slug === dbJob.job.id.slug && 
          APIJob.company.slug === dbJob.job.id.companySlug) {
            APIJob.inList = true;
          };
        })
      })
    })      
  })
  .catch(err=>next(err));
}

router.get('/', (req, res, next) => {
  axios({
    url: 'https://api.graphql.jobs/',
    method: 'POST',
    data: {
      query: allJobs('')
    }
  })
  .then((result) => {
    let jobs = [];
    for(let city of result.data.data.cities){
      for(let job of city.jobs){
        jobs.push(job);
      }
    }
    const data = {name: 'all', jobs: JSON.parse(JSON.stringify(jobs))};
    
    for(let job of data.jobs){
      job.logoUrl = job.company.websiteUrl
        .slice(job.company.websiteUrl.indexOf('//')+2);
    }

    if(req.session.user) applyFilter(req.session.user._id, data);

    res.render('index',{
      data, 
      googleMapsApi,
      user: req.session.user
    });
  })
  .catch((err) => {
    next(err); 
  });
});

router.post('/search', (req, res, next) => {
  const { location, title } = req.body;

  axios({
    url: 'https://api.graphql.jobs/',
    method: 'POST',
    data: {
      query: searchByLocation((location || '').toLowerCase(),(title || '').toLowerCase())
    }
  })
  .then(result => {
    const data = result.data.data.city;
    if(data) {
      for(let job of data.jobs) {
        job.logoUrl = job.company.websiteUrl
          .slice(job.company.websiteUrl.indexOf('//')+2);
      }
      if(req.session.user) applyFilter(req.session.user._id, data);
    } 

    const searchQuery = { location, title };

    res.render('index',{
      data,
      searchQuery,
      googleMapsApi,
      user: req.session.user
    });
  })
  .catch((err) => {
    // no city selected logic
    axios({
      url: 'https://api.graphql.jobs/',
      method: 'POST',
      data: {
        query: allJobs(title)
      }
    })
    .then(result => {
      let jobs = [];

      if(result.data.data.cities){
        for(let city of result.data.data.cities){
          for(let job of city.jobs){
            jobs.push(job);
          }
        }

        for(let job of jobs){
          job.logoUrl = job.company.websiteUrl
            .slice(job.company.websiteUrl.indexOf('//')+2);
        }
  
        if(req.session.user) applyFilter(req.session.user._id, jobs);
      }

      const data = {name: 'all', jobs: JSON.parse(JSON.stringify(jobs))};

      const searchQuery = {location: '',title};      

      res.render('index',{
        data,
        searchQuery,
        googleMapsApi,
        user: req.session.user
      });
  
    })
    .catch(err => next(err)); 
  });
});

router.get("/private-page", (req, res) => {
  if (!req.user) {
    res.redirect('auth/login');
  }
  res.render("private", {
    user: req.user
  });
});

module.exports = router;