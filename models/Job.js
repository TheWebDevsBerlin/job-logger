const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  job: {
    id: {
      slug: String,
      companySlug: String
    },
    data: {}
  }
});

const Job = mongoose.model('Job', jobSchema); 
module.exports = Job;