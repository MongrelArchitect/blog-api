const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  author: { required: true, type: String },
  post: { required: true, type: Schema.Types.ObjectId, ref: 'Post' },
  text: { required: true, type: String },
  timestamp: { required: true, type: Date },
});

module.exports = mongoose.model('Comment', CommentSchema);
