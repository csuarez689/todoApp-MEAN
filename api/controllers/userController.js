'use strict';
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.login = (req, res, next) => {
	let loggedUser;
	//buscar usuario por credenciales
	User.findByCredentials(req.body.email, req.body.password)
		.then((user) => {
			loggedUser = user;
			return user.generateAccessToken();
		})
		.then((token) => {
			res.header('x-access-token', token).json(loggedUser);
		})
		.catch((err) => {
			return next(err);
		});
};

exports.register = (req, res, next) => {
	let newUser = User(req.body);
	newUser
		.save()
		//creo un nuevo access token
		.then((user) => {
			newUser = user;
			return newUser.generateAccessToken();
		})
		.then((token) => {
			res.header('x-access-token', token).json(newUser);
		})
		.catch((err) => {
			next(err);
		});
};

exports.getNewAccessToken = (req, res, next) => {
	User.findById(req.userId)
		.then((user) => {
			return user.generateAccessToken();
		})
		.then((token) => {
			res.header('x-access-token', token).send();
		})
		.catch((err) => {
			return next(err);
		});
};

exports.getProfile = (req, res, next) => {
	User.findById(req.userId)
		.then((user) => res.status(200).json(user))
		.catch((err) => {
			return next(err);
		});
};

//Helpers
const comparePassword = (body, user) => {
	let error = new Error();
	error.status = 422;
	error.name = 'ValidationError';
	return new Promise((resolve, reject) => {
		if (body.newPassword !== body.newPasswordConfirmation) {
			error.message = 'Las contraseñas no coinciden';
			reject(error);
		} else {
			bcrypt.compare(newPassword, user.password, (err, res) => {
				if (res) resolve();
				//incorrect password
				else {
					error.message = 'Contraseña incorrecta';
					reject(error);
				}
			});
		}
	});
};
