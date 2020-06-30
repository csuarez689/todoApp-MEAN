'use strict';

//manejo de url invalida
exports.invalidURIHandler = (req, res, next) => {
	const error = new Error();
	error.status = 404;
	error.name = 'NotFound';
	error.message = 'Recurso no disponible';
	res.status(error.status).json(error);
};

// manejo de respuestas nulas y errores de casteo de _id en mongoose
exports.invalidResourceHandler = (err, req, res, next) => {
	if (res === null || (err.name === 'CastError' && err.path === '_id')) {
		const error = new Error();
		error.status = 404;
		error.name = 'NotFound';
		error.message = 'Recurso no disponible';
		res.status(error.status).json(error);
	} else next(err);
};

//manejo de errores de validacion de mongoose
//errores de casteo de fechas
//validaciones de id relacionados en modelos
exports.validationErrorHandler = (err, req, res, next) => {
	if (err.name == 'ValidationError') {
		if (err.errors) {
			const newFormat = {};
			const keys = Object.keys(err.errors);
			keys.forEach((key) => {
				let message;
				if (err.errors[key].kind === 'date') {
					message = 'Formato de fecha invalido';
				} else if (err.errors[key].kind == 'ObjectId') {
					message = `El ${err.errors[key].path} es un id invalido`;
				} else {
					message = err.errors[key].message;
				}
				newFormat[key] = message;
			});
			const newValidationError = new Error();
			newValidationError.status = 422;
			newValidationError.errors = newFormat;
			newValidationError.name = 'ValidationError';
			res.status(newValidationError.status).json(newValidationError);
		}
		res.status(err.status).json(err);
	} else next(err);
};

//manejo de errores de archivos
exports.filesErrorHandler = (err, req, res, next) => {
	if (err.name === 'MulterError' && err.code === 'LIMIT_FILE_SIZE') {
		let error = new Error();
		error.status = 422;
		error.name = 'ValidationError';
		error.message = { imagen: 'Tamaño maximo 1mb' };
		res.status(error.status).json(error);
	} else next(err);
};

//manejo de errores de authenticacion
exports.authErrorHandler = (err, req, res, next) => {
	if (err.name === 'Unauthorized') {
		res.status(err.status).json(err);
	} else next(err);
};

//manejo de errores genericos
exports.genericErrorHandler = (err, req, res, next) => {
	res.status(500).json({
		message: 'Ha ocurrido un error, intentelo mas tarde',
		name: 'ServerError',
	});
};
