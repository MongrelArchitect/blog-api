const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
  author: { required: true, type: String },
  post: { required: true, type: Schema.Types.ObjectId, ref: 'Post' },
  text: { required: true, type: String },
  timestamp: { required: true, type: Date },
});

CommentSchema.virtual('uri').get(function getUri() {
  return `/posts/${this.post}/comments/${this._id}`;
});

module.exports = mongoose.model('Comment', CommentSchema);
