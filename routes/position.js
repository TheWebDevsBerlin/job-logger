const express = require('express');
const router  = express.Router();
const axios = require('axios');
const {searchByID} = require('../queries');

router.get('/:company/:job', (req, res, next) => {
  const {company, job} = req.params;
  axios({
    url: 'https://api.graphql.jobs/',
    method: 'POST',
    data: {
      query: searchByID(company,job)
    }
  })
    .then(result => {
      const data = result.data.data.job;
      data.logoUrl = data.company.websiteUrl.slice(data.company.websiteUrl.indexOf('//')+2);
  
      res.render('jobDetails',{data});
    })
    .catch(err => next(err));
});

module.exports = router;

/*
job(input:{
  jobSlug:"senior-fullstack-engineer-platform"
  companySlug:"segment"
}){id}
*/