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
  status: Object,
  jobs: [{
    type: Schema.Types.ObjectId,
    ref: 'Job'
  }],
});

const User = mongoose.model('User', userSchema);
module.exports = User;