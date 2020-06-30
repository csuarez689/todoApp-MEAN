'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');
const path = require('path');

const listaSchema = new Schema(
	{
		titulo: {
			type: String,
			trim: true,
			required: [true, 'El titulo es obligatorio'],
			minlength: [3, 'El titulo debe contener al menos 3 caracteres'],
			maxlength: [30, 'El titulo no puede contener mas de 30 caracteres'],
		},
		fechaCreacion: {
			type: Date,
			default: Date.now,
		},
		fechaResolucion: { type: Date },
		estado: {
			required: [true, 'El campo estado es obligatorio'],
			type: String,
			enum: ['Pendiente', 'Terminado'],
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'El id del usuario es obligatorio'],
		},
	},
	{
		toJSON: {
			virtuals: true,
			versionKey: false,
			transform: (doc, ret) => {
				delete ret._id;
				delete ret.userId;
			},
		},
	}
);

listaSchema.pre('findOneAndRemove', function (next) {
	mongoose
		.model('Lista')
		.findById(this._conditions._id)
		.then((res) => {
			if (res && !res.fechaResolucion) {
				const err = new Error();
				err.status = 422;
				err.message = 'No se puede eliminar una lista con tareas pendientes';
				err.name = 'ValidationError';
				return next(err);
			}
			return next();
		})
		.catch((err) => {
			return next(err);
		});
});

listaSchema.post('findOneAndRemove', function (doc, next) {
	if (!doc) return next();
	mongoose
		.model('Tarea')
		.find({ idLista: doc.id })
		.cursor()
		.eachAsync((task) => {
			if (task.imagen)
				fs.unlinkSync(
					path.join(__dirname, `../uploads/${doc.userId}/${task.imagen}`)
				);
			task.remove();
		})
		.then(() => {
			return next();
		})
		.catch((err) => {
			return next(err);
		});
});

module.exports = mongoose.model('Lista', listaSchema);
