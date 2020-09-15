const express = require('express');
const router  = express.Router();
const axios = require('axios');

router.get('/:company/:job', (req, res, next) => {
  const {company, job} = req.params;
  axios({
    url: 'https://api.graphql.jobs/',
    method: 'POST',
    data: {
      query: `
      query {
        job(input: {
          jobSlug:"${job}"
          companySlug:"${company}"
        }){
          title
          commitment{
            title
          }
          description
          applyUrl
          company{
            name
            websiteUrl
            jobs{title}
            logoUrl
          }
          locationNames
          remotes{name}
          cities{
            name
            country {name}
            type
            slug
            jobs {
              id
              title
            }
          }
          postedAt
        }
      }
  `}})
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