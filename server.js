require('dotenv').config() //REQUISIÇÃO DO ARQUIVO .env QUE CONTÉM NOSSAS CREDENCIAIS DE ACESSO
console.log('conectando...')
const express = require('express')
const app = express();
const mongoose = require('mongoose') //IRÁ INFORMAR QUE A BASE DE DADOS ESTÁ CONECTADA... PORTAS JÁ PODEM SER ESCUTADAS
mongoose.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => { //mongoose.connect() --> RETORNA UMA PROMISE, POIS A CONEXÃO DEMORA PARA SER ESTABELECIDA COM O SERVIDOR
        console.log()
        console.log('--- CONEXÃO ESTABELECIDA ---')
        console.log('--- HELMET DESABILITADO TEMPORARIAMENTE ---')
        app.emit('pronto') //EMITE UM SINAL ASSIM QUE A CONEXÃO FOR ESTABELECIDA
    })
    .catch(e => console.log(e))

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const validator = require('validator')

const routes = require('./routes')
const path = require('path')
//const helmet = require('helmet')
const csrf = require('csurf')
const middlewares = require('./src/middlewares/middleware')

//app.use(helmet())
app.use(express.urlencoded({extended:true}))
app.use(express.json())//PERMITE O "PARSE" DE JSON PRA DENTRO DA APLICAÇÃO
app.use(express.static(path.resolve(__dirname, 'public'))) //RESOLVENDO O CAMINHO DE PUBLIC 
                                                            //(express.static) == ARQUIVOS ESTÁTICOS 

const sessionOptions = session({//CONFIGURAÇÕES DE SESSÃO
    secret:'suquinho_de_maracuja',
    store: MongoStore.create({mongoUrl: process.env.CONNECTIONSTRING}), ///ONDE A SESSÃO SERÁ SALVA {CLIENTE DE CONEXÃO}
    resave: false, 
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, //QUANTO TEMPO, EM MS, ESSE COOKIE IRÁ DURAR (neste caso setamos 7 dias)
        httpOnly: true
    }
});
app.use(sessionOptions) //ORDENANDO QUE app USE sessionOptions
app.use(flash())
app.use(csrf())
app.use(middlewares.middlewareGlobal)
app.use(middlewares.checkCsrfError)
app.use(middlewares.csrfMiddleware)
app.use(routes)
                                             

app.set('views', path.resolve(__dirname, 'src', 'views')) // RESOLVENDO O CAMINHO DE VIEWS
app.set('view engine', 'ejs')

app.on('pronto', () => { //SÓ IRÁ LIGAR O SERVIDOR QUANDO app EMITIR O SINAL DE "pronto"
    app.listen(3000, () =>{
        console.log('Acessar http://localhost:3000')
        console.log('Servidor executando na porta 3000')
    })   
})
