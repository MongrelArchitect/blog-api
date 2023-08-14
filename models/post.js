const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  author: { required: true, type: Schema.Types.ObjectId },
  published: { required: true, type: Boolean },
  text: { required: true, type: String },
  timestamp: { required: true, type: Date },
  title: { required: true, type: String },
});

module.exports = mongoose.model('Post', PostSchema);
