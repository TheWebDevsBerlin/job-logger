const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const Job = require('../models/Job');

const {allJobs} = require('../queries');

const googleMapsApi = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&callback=initMap&libraries=places&v=weekly`;

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

    if(req.session.user) {
      console.log('connecting and bringing jobs');
      User.findById(req.session.user._id)
      .populate('job')
      .then(dbUser=>{
        dbUser.jobs.forEach(jobId=>{
          console.log({jobId});
          Job.findById({_id: jobId})
            .then(job=>{
              console.log({ALL:jobs[0].slug});
              console.log({ALL:jobs[0].company.slug});
              console.log({title: job._id});
              // console.log({company: job.data.company.slug});
            });
        });
      })
      .catch(err=>next(err));
    }

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
      console.log({data});
      for(let job of data.jobs) {
        job.logoUrl = job.company.websiteUrl
          .slice(job.company.websiteUrl.indexOf('//')+2);
      }
    } 

    const searchQuery = {location,title};
    console.log(searchQuery);

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
        for(let city of result.data.data.cities){
          for(let job of city.jobs){
            jobs.push(job);
          }
        }
        const data = {name: 'all', jobs: JSON.parse(JSON.stringify(jobs))};
        const searchQuery = {location: '',title};
    
        for(let job of this){
          job.logoUrl = job.company.websiteUrl
            .slice(job.company.websiteUrl.indexOf('//')+2);
        }
          
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