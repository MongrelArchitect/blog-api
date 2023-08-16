const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
  author: { required: true, type: Schema.Types.ObjectId, ref: 'User' },
  lastEdited: Date,
  published: { required: true, type: Boolean },
  text: { required: true, type: String },
  timestamp: { required: true, type: Date },
  title: { required: true, type: String },
});

PostSchema.virtual('uri').get(function getUri() {
  return `/posts/${this._id}`;
});

PostSchema.virtual('comments').get(function getUri() {
  return `/posts/${this._id}/comments`;
});

module.exports = mongoose.model('Post', PostSchema);
