import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Register from './modules/Register'
import Login from './modules/Login'
import Chamado from './modules/AberturaChamados'

//VALIDAÇÃO DO FORMULÁRIO DE CADASTRO DE USUÁRIOS
const register = new Register('.form-cadastro')
register.init()

//VALIDAÇÃO DO FORMULÁRIO DE LOGIN
const login = new Login('.form-login')
login.init()

//VALIDDAÇÃO DO FORMULÁRIO DE ABERTURA DE CHAMADOS
const chamado = new Chamado('.form-chamado')
chamado.init()



import './assets/bootstrap/bootstrap.min.css'
import './assets/bootstrap/bootstrap.bundle.min.js'
import './assets/css/style.css'
import './assets/bootstrap/popper.min.js'

