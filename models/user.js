const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  email: { required: true, type: String },
  name: { required: true, type: String },
  password: { required: true, type: String },
});

module.exports = mongoose.model('User', UserSchema);
