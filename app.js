const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const indexRouter = require('./routes/index');

const app = express();

// set up mongoose
mongoose.set('strictQuery', true);
const mongoDB = process.env.ATLAS;
async function connectMongoDB() {
  await mongoose.connect(mongoDB);
}
connectMongoDB().catch((err) => console.error(err));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

module.exports = app;
