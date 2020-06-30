'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const { appHeaders } = require('./middlewares/headersMiddleware');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const indexRouter = require('./routes/indexRoutes');
const apiRouter = require('./routes/apiRoutes');
require('dotenv').config();

const app = express();

mongoose
	.connect(process.env.MONGODB_URL_DEV, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		serverSelectionTimeoutMS: 5000,
		useCreateIndex: true,
	})
	.catch((err) => console.log(`Error : ${err}`));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(cors({ origin: process.env.ANGULAR_SERVER }));
app.use(appHeaders);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.use(errorHandler.invalidURIHandler);
app.use(errorHandler.authErrorHandler);
app.use(errorHandler.invalidResourceHandler);
app.use(errorHandler.filesErrorHandler);
app.use(errorHandler.validationErrorHandler);
app.use(errorHandler.genericErrorHandler);

module.exports = app;
