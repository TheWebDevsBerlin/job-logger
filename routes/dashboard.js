const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');



//edit and delete functionality

router.get('/delete', (req, res) => {
  const id = req.job._id;
  Job.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/dashboard');
      console.log(req.body);
    })
    .catch(error => {
      console.log(error);
    })
});


router.post(
  "/job/edit", (req, res) => {
    console.log("this is the request", req.body, req.job)
    const {
      title, description
    } = req.body;
    Job.findByIdAndUpdate(req.job._id, {
        title, description
      })

      .then(job => {
        res.redirect(`/`);
      })
      .catch(err => {
        next(err);
      });
  }
);


module.exports = router;