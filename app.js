const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const loginRoutes = require('./routes/login');
const postsRoutes = require('./routes/posts');

const app = express();

// set up mongoose
mongoose.set('strictQuery', true);
const mongoDB = process.env.ATLAS;
async function connectMongoDB() {
  await mongoose.connect(mongoDB);
}
connectMongoDB().catch((err) => console.error(err));

const json404 = (req, res, next) => {
  res
    .status(404)
    .json({
      status: 404,
      message: `${req.url} not found for ${req.method} request`,
    });
};

const jsonError = (err, req, res, next) => {
  res
    .status(500)
    .json({
      status: 500,
      message: err.message,
    });
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/login', loginRoutes);
app.use('/posts', postsRoutes);

app.use(json404);
app.use(jsonError);

module.exports = app;
