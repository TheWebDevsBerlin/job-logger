const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  firstName: String,
  surName: String, 
  address: {
    street: String,
    city: String,
    zip: Number,
  },
  jobs: 
    {
      id: {
        title: String,
        company: String
      },
      data: {
        title: String,
        company: String,
        location: String,
        salary: Number,
        description: String,
        applyUrl: String,
        websiteUrl: String,
        logoUrl: String,
        contact: String,
        createdAt: Date,
        updatedAt: Date
      }
    }
  
  // jobs: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'JobSchema'
  // },
});

const User = mongoose.model('User', userSchema);
module.exports = User;