'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tareaController = require('../controllers/tareaController');
const auth = require('../middlewares/auth');
const apiPrivateRoutes = require('./apiPrivateRoutes');

//___________________USER ROUTES________________________

//registro de usuario
router.post('/users/register', userController.register);

//login
router.post('/users/login', userController.login);

//serve image
router.get(
	'/listas/:idLista/tareas/:idTarea/imagen',
	tareaController.serveImage
);

//rutas privadas
router.use('/', auth, apiPrivateRoutes);

module.exports = router;
