const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  job: {
    id: {
      title: String,
      company: String
    },
    data: {}
  }
});

const Job = mongoose.model('Job', jobSchema); 
module.exports = Job;