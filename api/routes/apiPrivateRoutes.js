'use strict';

const express = require('express');
const router = express.Router();
const listaController = require('../controllers/listaController');
const tareaController = require('../controllers/tareaController');
const userController = require('../controllers/userController');

////___________________USER PRIVATE ROUTES________________________
//actualizar usuario
// router.patch('/users', userController.update);

//obtener datos del usuario
router.get('/users/me', userController.getProfile);

//renueva accestoken --- solo si esta authenticado
//para evitar tener que guardar datos de sesion como refreshtoken
router.get('/users/refreshToken', userController.getNewAccessToken);

//___________________LIST PRIVATE ROUTES________________________
/* Todas las listas */
router.get('/listas', listaController.index);
// Una lista
router.get('/listas/:idLista', listaController.show);
// guardar una nueva lista
router.post('/listas', listaController.store);
// borrar una lista si no tiene tareas pendiente asignadas
router.delete('/listas/:idLista', listaController.delete);
// actualizar una lista
router.put('/listas/:idLista', listaController.update);

//___________________TASKS PRIVATE ROUTES_______________________

// obtener las tareas de una lista
router.get('/listas/:idLista/tareas', tareaController.getAllTasksFromList);
//obtener una tarea
router.get(
	'/listas/:idLista/tareas/:idTarea',
	tareaController.getOneTaskFromList
);
// almacenar una nueva tarea
router.post('/listas/:idLista/tareas', tareaController.store);
//eliminar una tarea
router.delete('/listas/:idLista/tareas/:idTarea', tareaController.delete);
//actualizar una tarea
router.put('/listas/:idLista/tareas/:idTarea', tareaController.update);
//subir imagen de tarea
router.post('/listas/:idLista/tareas/:idTarea/imagen', tareaController.upload);

module.exports = router;
