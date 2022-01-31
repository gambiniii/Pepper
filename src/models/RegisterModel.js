const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const cpf = require('../../frontend/modules/validaCPF')

const RegisterSchema = new mongoose.Schema({
    nome: {type: String, required: true}, //required --> SE NÃO FOR ENVIADO, IMPLICARÁ EM UM ERRO
    sobrenome: {type: String, required: true},
    cpf: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    userType: {type: String, required: false, default: 'default'},
    dtCriacao: {type: String, required: false, default: Date.now}
})

const RegisterModel = mongoose.model('Register', RegisterSchema);

class Register{
    constructor(body){
        this.body = body
        this.errors = []
        this.user = null //RECEBE UM USUÁRIO JÁ EXISTENTE... SE FOR VERDADEIRO, IMPEDE O CADASTRO
    }

    async register(){
        this.valida(this.body);
        await this.userExists()
        if(this.errors.length > 0) return

        const salt = bcryptjs.genSaltSync()
        this.body.password = bcryptjs.hashSync(this.body.password, salt)

        if(this.body.isAdmin){
            this.body.userType = "admin"
        } else {
            this.body.userType = "default"
        }

        this.body.dtCriacao = this.criaData()

        this.user = await RegisterModel.create(this.body)
    }

    async updateUser(id){
        this.valida(this.body)
        if(this.errors.length > 0)return

        const salt = bcryptjs.genSaltSync()
        this.body.password = bcryptjs.hashSync(this.body.password, salt)

        if(this.body.isAdmin){
            this.body.userType = "admin"
        } else {
            this.body.userType = "default"
        }

        const user = await RegisterModel.findByIdAndUpdate(id, this.body, {new: true})
        return user
    }


    valida(body){
        this.cleanUp(this.body)
        const validacaoCPF = new cpf.criaCPF(this.body.cpf)

        if(!body.nome.match(/^[a-zA-Z]+$/g)) this.errors.push('O nome só pode conter letras')

        if(!body.sobrenome.match(/^[a-zA-Z]+$/g)) this.errors.push('O sobrenome só pode conter letras')

        if(!validator.isEmail(body.email)) this.errors.push('Email inválido')

        if(body.password.length == 0) this.errors.push('A senha não pode estar vazia')
        if(body.password.length <3 || body.password.length >20 ) this.errors.push('A senha deve conter entre 3 e 20 caracteres')

        if(!validacaoCPF.validaCPF()) this.errors.push("CPF inválido")
    }

    cleanUp(obj){
        for(let key in obj){
            if(typeof obj[key] !== 'string') obj[key] = ''
        }
        obj = {
            nome: obj.nome,
            sobrenome: obj.sobrenome,
            cpf: obj.cpf,
            email: obj.email,
            password: obj.password
        }
    }

    async userExists(){
        this.user = await RegisterModel.findOne({cpf: this.body.cpf})
        if(this.user) return this.errors.push('CPF já cadastrado')

        this.user = await RegisterModel.findOne({email: this.body.email})
        if(this.user) return this.errors.push('E-mail já cadastrado')       
    }

    
    static async findAllUsers(){
        const users = await RegisterModel.find()
        return users
    }

    static async findUserById(id){
        const user = await RegisterModel.findById(id)
        return user
    }

    static async deleteUser(id){
        if(typeof id !== 'string') return
        const deleted = await RegisterModel.findByIdAndDelete(id)
        return deleted
    }

    criaData(){
        let data = new Date();
        let dataAtual = new Intl.DateTimeFormat('pt-BR').format(data)
        return dataAtual
    }


}

module.exports = RegisterModel
module.exports = Register