'use strict';
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
	let error = new Error();
	error.status = 401;
	error.name = 'Unauthorized';
	error.message = 'No tiene autorización';
	if (!req.header('authorization')) return res.status(error.status).send(error);

	const token = req.header('authorization').split(' ')[1];
	jwt.verify(token, User.getSecret(), (err, decoded) => {
		if (err) {
			return res.status(error.status).send(error);
		} else {
			req.userId = decoded._id;
			return next();
		}
	});
};

module.exports = auth;
