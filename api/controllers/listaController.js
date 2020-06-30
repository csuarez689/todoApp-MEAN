'use strict';

const Lista = require('../models/lista');
const Tarea = require('../models/tarea');

//GET --Retorna todas las listas del usuario
exports.index = (req, res, next) => {
	Lista.find({ userId: req.userId })
		.then((listas) => res.status(200).json(listas))
		.catch((err) => {
			return next(err);
		});
};

//GET --Retorna una lista
exports.show = (req, res, next) => {
	Lista.findOne({ _id: req.params.idLista, userId: req.userId })
		.then((lista) => {
			if (!lista) return next();
			res.status(200).json(lista);
		})
		.catch((err) => {
			return next(err);
		});
};

//POST --Crea una nueva lista y la retorna
exports.store = (req, res, next) => {
	let newLista = new Lista({
		titulo: req.body.titulo,
		//toda lista nueva se crea con estado terminado
		//porque no posee tareas asignadas
		estado: 'Terminado',
		fechaResolucion: Date.now(),
		userId: req.userId,
	});
	newLista
		.save()
		.then((lista) => res.status(201).json(lista))
		.catch((err) => {
			return next(err);
		});
};

// PUT -- Actualiza una lista y la retorna
exports.update = (req, res, next) => {
	Lista.findOneAndUpdate(
		{
			_id: req.params.idLista,
			userId: req.userId,
		},
		{ titulo: req.body.titulo },
		{ runValidators: true, new: true }
	)
		.then((lista) => {
			if (!lista) return next();
			res.status(200).json(lista);
		})
		.catch((err) => {
			return next(err);
		});
};

//DELETE --ELimina una lista y retorna el id
exports.delete = (req, res, next) => {
	Lista.findOneAndRemove({ _id: req.params.idLista, userId: req.userId })
		.then((lista) => {
			if (!lista) return next();
			res.status(200).json({ id: lista._id });
		})
		.catch((err) => {
			return next(err);
		});
};
