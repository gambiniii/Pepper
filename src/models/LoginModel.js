const mongoose = require('mongoose')
const RegisterModel = require('./RegisterModel')
const Register = require('./RegisterModel')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const usuario = mongoose.model('Register', RegisterModel.RegisterSchema)
const register = new Register(this.body)

class Login{
    constructor(body){
        this.body = body
        this.errors = []
        this.user = null
    }

    async login(){
        this.validaLogin()
        if(this.errors.length > 0) return
    
        this.user = await usuario.findOne({email: this.body.email})
    
        if(!this.user){
            this.errors.push('E-mail ou senha incorretos!')
            return this.user = null
        }
        if(!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.errors.push('Senha inválida!')
            return this.user = null
        }
    }
    
    validaLogin(){
        register.cleanUp(this.body)
        if(!validator.isEmail(this.body.email)) this.errors.push('Email inválido')
        if(this.body.password.length == 0) this.errors.push('A senha não pode estar vazia')
        if(this.body.password.length <3 ||this.body.password.length >20 ) this.errors.push('A senha deve conter entre 3 e 20 caracteres')
    }
}

module.exports = Login