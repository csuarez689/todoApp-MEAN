'use strict';

const Tarea = require('../models/tarea');
const fs = require('fs');
const path = require('path');
const uploadFile = require('../middlewares/uploadFile');
const Lista = require('../models/lista');
const user = require('../models/user');

//GET --Retorna las tareas de una lista
exports.getAllTasksFromList = (req, res, next) => {
	//puede recbir +|- attributeName --- sort_by=+attribute --- sort_by=-attribute
	checkIfListBelongsToUser(req.userId, req.params.idLista)
		.then(() => {
			return Tarea.find({ idLista: req.params.idLista }).sort(
				req.query.sort_by
			);
		})
		.then((tareas) => res.status(200).json(tareas))
		.catch((err) => {
			return next(err);
		});
};

//GET --Retorna una tarea
exports.getOneTaskFromList = (req, res, next) => {
	checkIfListBelongsToUser(req.userId, req.params.idLista)
		.then(() => {
			return Tarea.findOne({
				_id: req.params.idTarea,
				idLista: req.params.idLista,
			});
		})
		.then((tarea) => {
			if (!tarea) return next();
			res.status(200).json(tarea);
		})
		.catch((err) => {
			return next(err);
		});
};

//POST --Crea una nueva tarea y la retorna
exports.store = (req, res, next) => {
	checkIfListBelongsToUser(req.userId, req.params.idLista)
		.then(() => {
			let newTarea = new Tarea({
				titulo: req.body.titulo,
				descripcion: req.body.descripcion,
				prioridad: req.body.prioridad,
				fechaLimite: req.body.fechaLimite
					? Date.parse(req.body.fechaLimite)
					: null,
				fechaResolucion: req.body.estado == 'Terminado' ? Date.now() : null,
				estado: req.body.estado,
				idLista: req.params.idLista,
			});
			return newTarea.save();
		})
		.then((tarea) => res.status(201).json(tarea))
		.catch((err) => {
			return next(err);
		});
};

// PUT|PATCH -- Actualiza una tarea y la retorna
exports.update = (req, res, next) => {
	checkIfListBelongsToUser(req.userId, req.params.idLista)
		.then(() => {
			return Tarea.findOne({
				_id: req.params.idTarea,
				idLista: req.params.idLista,
			});
		})
		.then((tarea) => {
			//vacio para 404
			if (!tarea) return Promise.reject();
			else if (tarea.estado == 'Terminado') {
				let error = new Error();
				error.message = 'No es posible editar una tarea terminada';
				error.name = 'ValidationError';
				error.status = 422;
				return Promise.reject(error);
			} else {
				tarea.titulo = req.body.titulo;
				tarea.descripcion = req.body.descripcion;
				tarea.prioridad = req.body.prioridad;
				tarea.estado = req.body.estado;
				tarea.fechaLimite = req.body.fechaLimite ? req.body.fechaLimite : null;
				tarea.fechaResolucion =
					req.body.estado == 'Terminado' ? Date.now() : null;
				//mantengo esto porque puedo estar editando tarea
				//para cambiarla de lista
				tarea.idLista = req.body.idLista;
				return tarea.save();
			}
		})
		.then((tarea) => res.status(200).json(tarea))
		.catch((err) => {
			return next(err);
		});
};

//DELETE --ELimina una tarea y retorna el id
exports.delete = (req, res, next) => {
	checkIfListBelongsToUser(req.userId, req.params.idLista)
		.then(() => {
			return Tarea.findOneAndRemove({
				_id: req.params.idTarea,
				idLista: req.params.idLista,
			});
		})
		.then((tarea) => {
			//si existia imagen anteriormente la elimino
			if (!tarea) return next();
			if (tarea.imagen) {
				fs.unlinkSync(
					path.join(__dirname, `../uploads/${req.userId}/${tarea.imagen}`)
				);
			}
			res.status(200).json({ id: tarea._id });
		})
		.catch((err) => {
			return next(err);
		});
};

//actualiza imagen de la tarea
exports.upload = (req, res, next) => {
	checkIfListBelongsToUser(req.userId, req.params.idLista)
		.then(() => {
			return Tarea.findById(req.params.idTarea);
		})
		.then((tarea) => {
			if (!tarea) return next();

			//manejo de imagen
			uploadFile(req, next, (err) => {
				if (err || !req.file) {
					const error = new Error();
					error.status = 422;
					error.name = 'ValidationError';
					error.message = 'Debe enviar una imagen';
					return err ? next(err) : next(error);
				}
				let oldFile = tarea.imagen;
				tarea.imagen = req.file.filename;
				tarea
					.save()
					.then((tarea) => {
						// si tenia imagen la borro
						oldFile &&
							fs.existsSync(`${req.file.destination}${oldFile}`) &&
							fs.unlinkSync(`${req.file.destination}${oldFile}`);
						res.status(200).json(tarea);
					})
					.catch((err) => {
						//si ocurrio error elimino la imagen subida recientemente
						fs.unlinkSync(`${req.file.destination}/${tarea.imagen}`);
						return next(err);
					});
			});
		})
		.catch((err) => {
			return next(err);
		});
};

exports.serveImage = (req, res, next) => {
	let user;
	Lista.findOne({ _id: req.params.idLista })
		.then((lista) => {
			if (!lista) return Promise.reject();
			user = lista.userId;
			return lista;
		})
		.then((lista) => {
			return Tarea.findOne({ _id: req.params.idTarea, idLista: lista._id });
		})
		.then((tarea) => {
			if (!tarea) return next();
			let imagePath = path.join(
				__dirname,
				`../uploads/${user}/${tarea.imagen}`
			);
			if (!fs.existsSync(imagePath)) return next();
			else res.sendFile(imagePath);
		})
		.catch();
};

//helpers
const checkIfListBelongsToUser = (userId, listId) => {
	return Lista.findOne({ _id: listId, userId: userId }).then((list) => {
		if (list) return Promise.resolve(list);
		return Promise.reject(); //reject vacio para middleware 404
	});
};
