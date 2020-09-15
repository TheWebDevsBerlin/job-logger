const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jobSchema = new Schema({
  jobs: [{
    id: Object,
    title: String,
    company: String,
    location: String,
    salary: Number,
    description: String,
    applyUrl: String,
    websiteUrl: String,
    logoUrl:Image,
    contact: String,
    createdAt: Date,
    updatedAt: Date
  }],
});

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;