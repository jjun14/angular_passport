var mongoose = require('mongoose');
//create genericSchema
var UserSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, trim: true, unique: true },
  password: String,
  fb: {
    id: String,
    access_token: String,
    first_name: String,
    last_name: String,
    email: String
  }
});

mongoose.model('User', UserSchema);
