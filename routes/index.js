const express = require('express');
const router = express.Router();
const axios = require('axios');

const googleMapsApi = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&callback=initMap&libraries=places&v=weekly`;

router.get('/', (req, res, next) => {
  axios({
    url: 'https://api.graphql.jobs/',
    method: 'POST',
    data: {
      query: `
      query {
        jobs(input: {
          type:""
        }){
          title
          slug
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
            slug
            jobs{slug}
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
      `
    }
  })
  .then((result) => {
    const data = result.data.data;
    for(let job of data.jobs){
      job.logoUrl = job.company.websiteUrl
        .slice(job.company.websiteUrl.indexOf('//')+2);
    }
    res.render('index',{
      data, 
      googleMapsApi,
      user: req.user
    });
  })
    .catch((err) => {
      next(err); 
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