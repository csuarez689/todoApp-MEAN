'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tareaSchema = new Schema(
	{
		titulo: {
			type: String,
			required: [true, 'El titulo es obligatorio'],
			minlength: [3, 'El titulo debe contener al menos 3 caracteres'],
			maxlength: [30, 'El titulo no puede contener mas de 30 caracteres'],
			trim: true,
		},
		fechaCreacion: { type: Date, default: Date.now() },
		fechaResolucion: { type: Date }, //pre save o update
		fechaLimite: { type: Date },
		descripcion: {
			type: String,
			trim: true,
		},
		prioridad: {
			type: String,
			required: [true, 'El campo prioridad es obigatorio'],
			enum: ['Baja', 'Media', 'Alta'],
		},
		imagen: { type: String, default: null },
		estado: {
			type: String,
			required: [true, 'El campo estado es obligatorio'],
			enum: ['Pendiente', 'En Proceso', 'Terminado'],
		},
		idLista: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Lista',
			required: [true, 'El id de la lista es obligatorio'],
		},
	},
	{
		toJSON: {
			virtuals: true,
			versionKey: false,
			transform: (doc, ret) => {
				delete ret._id;
			},
		},
	}
);

// propiedad links virtuales
// tareaSchema.virtual('links').get(function () {
// 	let x = {
// 		self: `http://localhost:3000/api/tareas/${this._id}`,
// 		uploadImage: `http://localhost:3000/api/tareas/${this._id}/imagen`,
// 	};
// 	if (this.idLista)
// 		x['lista'] = `http://localhost:3000/api/listas/${this.idLista}`;
// 	if (this.imagen) {
// 		x['urlImagen'] = `http://localhost:3000/images/${this.imagen}`;
// 	}
// 	return x;
// });

//validacion fechalimite
tareaSchema.path('fechaLimite').validate(function (v) {
	if (v && v <= Date.now()) {
		throw new Error('La fecha limite debe ser mayor que la fecha actual');
	}
	return true;
}, 'La fecha limite debe ser mayor que fecha actual');

//control idLista valido
tareaSchema.pre(['save', 'findOneAndUpdate'], function (next) {
	//obtengo lista padre
	mongoose
		.model('Lista')
		.findOne({ _id: this.idLista })
		.then((lista) => {
			//lista invalida
			if (!lista) {
				let error = new Error();
				error.message = 'La lista asignada no es existe';
				error.name = 'ValidationError';
				error.status = 422;
				return next(error);
			} else {
				return next();
			}
		})
		.catch((err) => {
			return next(err);
		});
});

//actualizacion estado y fecha de lista padre
tareaSchema.post(['save', 'findOneAndUpdate', 'findOneAndRemove'], function (
	doc
) {
	let parentList;
	mongoose
		.model('Lista')
		.findOne({ _id: doc.idLista })
		.then((list) => {
			parentList = list;
			return mongoose
				.model('Tarea')
				.findOne({ idLista: doc.idLista, estado: { $ne: 'Terminado' } });
		})
		.then((res) => {
			if (res) {
				//si hay tareas pendientes en la lista
				parentList.fechaResolucion = null;
				parentList.estado = 'Pendiente';
				parentList.save();
			} else {
				//si todas las tareas estan concluidas
				parentList.fechaResolucion = Date.now();
				parentList.estado = 'Terminado';
				parentList.save();
			}
		})
		.catch((err) => {
			return err;
		});
});

module.exports = mongoose.model('Tarea', tareaSchema);
//actualizacion estado y fecha lista padre
