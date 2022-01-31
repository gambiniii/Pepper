const express = require('express')
const route = express.Router();
const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')
const registerController = require('./src/controllers/registerController')
const chamadosController = require('./src/controllers/chamadosController');

const {loginRequired, adminRequired} = require('./src/middlewares/middleware')

//Rotas da Home
route.get('/', homeController.paginaInicial)


//Rotas de login
route.get('/login', loginController.loginHomePage)
route.post('/login/login', loginController.loginUser)
route.get('/login/logout', loginController.logout)


//Rotas de register
route.get('/register', registerController.registerHomePage)
route.post('/register/register', registerController.registerUser)


//Rotas de usuários cadastrados
route.get('/user', adminRequired, registerController.userHomepage)
route.get('/user/delete/:id', adminRequired, registerController.deleteUser)
route.get('/register/editUser/:id', adminRequired, registerController.editUser)
route.post('/register/update/:id', adminRequired, registerController.update)


//Rotas de chamados
route.get('/chamados', loginRequired, chamadosController.chamadosHomePage)
route.post('/chamados/abrirChamado', loginRequired, chamadosController.abrirChamado)


//Rotas de chamados ativos
route.get('/chamadosAtivos', loginRequired, chamadosController.chamadosAtivosHomePage)
route.get('/chamadosFinalizados', adminRequired, chamadosController.chamadosFinalizadosHomePage)
route.get('/chamadosAtivos/tk/:id', loginRequired, chamadosController.visualizarChamado)
route.post('/chamadosAtivos/tkUpdate/:id', loginRequired, chamadosController.inserirAndamento)
route.get('/chamadosAtivos/updateStatus/:id/:status', loginRequired, chamadosController.updateStatus)


//Rotas de chamados ativos (ADM)
route.get('/chamadosADM', adminRequired, chamadosController.chamadosADMHomePage)




module.exports = route
