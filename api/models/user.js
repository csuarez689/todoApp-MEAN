'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
require('dotenv').config();

const userSchema = new mongoose.Schema(
	{
		nombre: {
			type: String,
			required: [true, 'El nombre es obligatorio'],
			minlength: [2, 'El nombre debe contener al menos 3 caracteres'],
			maxlength: [30, 'El nombre no puede contener mas de 30 caracteres'],
			trim: true,
		},
		apellido: {
			type: String,
			required: [true, 'El apellido es obligatorio'],
			minlength: [2, 'El apellido debe contener al menos 3 caracteres'],
			maxlength: [30, 'El apellido no puede contener mas de 30 caracteres'],
			trim: true,
		},
		email: {
			type: String,
			required: [true, 'El email es obligatorio'],
			lowercase: true,
			unique: true,
			trim: true,
			validate: {
				validator: function (email) {
					return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
				},
				message: 'Email invalido',
			},
		},
		password: {
			type: String,
			required: [true, 'La contraseña es obligatoria'],
			minlength: [6, 'La contraseña debe contener al menos 6 caracteres'],
		},
	},
	{
		toJSON: {
			virtuals: true,
			versionKey: false,
			transform: (doc, ret) => {
				delete ret._id;
				delete ret.password;
				delete ret.session;
			},
		},
	}
);

//unique email error custom message
userSchema.plugin(uniqueValidator, {
	message: 'Este email ya se encuentra registrado',
});

//generar access token
userSchema.methods.generateAccessToken = function () {
	const user = this;
	return new Promise((resolve, reject) => {
		jwt.sign(
			{ _id: user._id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME },
			(err, token) => {
				if (!err) resolve(token);
				else reject(err);
			}
		);
	});
};

//find user by email and password
userSchema.statics.findByCredentials = function (email, password) {
	let user = this;
	let error = new Error();
	error.status = 401;
	error.name = 'Unauthorized';
	return user.findOne({ email: email }).then((user) => {
		//user not exists
		if (!user) {
			error.message = 'El usuario no existe';
			return Promise.reject(error);
		}
		//user check password
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) resolve(user);
				//incorrect password
				else {
					error.message = 'Contraseña incorrecta';
					reject(error);
				}
			});
		});
	});
};

userSchema.pre('save', function (next) {
	let user = this;
	let factor = 10;
	//check if user password has change
	if (user.isModified('password')) {
		// generates salt and hash for user password
		bcrypt.genSalt(factor, (err, salt) => {
			if (err) return next(err);
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) return next(err);
				user.password = hash;
				return next();
			});
		});
	} else next();
});

//-----------helpers-----------

//get secret
userSchema.statics.getSecret = () => {
	return process.env.JWT_SECRET;
};

module.exports = mongoose.model('User', userSchema);
