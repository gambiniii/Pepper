import validator from "validator";
const cpf = require('./validaCPF')


export default class Register{
    constructor(formClass){
        this.form = document.querySelector(formClass)
    }


    init(){
        this.events();
    }

    events(){
        if(!this.form) return

        this.form.addEventListener('submit', e => {
            e.preventDefault()
            this.validate(e)
        })
    }

    generateError(mensagemErro, campo){
        const erro = document.createElement('div')
        erro.innerHTML = mensagemErro
        erro.classList.add('errorText');
        campo.insertAdjacentElement('afterend', erro);
    }

    validate(e){
        let error = false

        for(let msgErro of this.form.querySelectorAll('.errorText')){ 
            msgErro.remove()
        };

        const el = e.target
        let nomeInput = el.querySelector('input[name="nome"]')
        let sobrenomeInput = el.querySelector('input[name="sobrenome"]')
        let cpfInput = el.querySelector('input[name="cpf"]')
        let emailInput = el.querySelector('input[name="email"]')
        let passwordInput = el.querySelector('input[name="password"]')
        let confirmPasswordInput = el.querySelector('input[name="confirmPassword"]')
        const validacaoCPF = new cpf.criaCPF(cpfInput.value)


        if(!nomeInput.value.length > 0){
            this.generateError(`O campo ${nomeInput.name} não pode estar vazio`, nomeInput)
            error = true
        } else if (!nomeInput.value.match(/^[a-zA-Z]+$/g)){
            this.generateError(`O campo ${nomeInput.name} só pode conter letras`, nomeInput)
            error = true
        } else {
            nomeInput.value = nomeInput.value.slice(0,1).toUpperCase() + nomeInput.value.slice(1).toLowerCase()
        }


        
        if(!sobrenomeInput.value.length > 0){
            this.generateError(`O campo ${sobrenomeInput.name} não pode estar vazio`, sobrenomeInput)
            error = true
        } else if (!sobrenomeInput.value.match(/^[a-zA-Z]+$/g)){
            this.generateError(`O campo ${sobrenomeInput.name} só pode conter letras`, sobrenomeInput)
            error = true
        } else {
            sobrenomeInput.value = sobrenomeInput.value.slice(0,1).toUpperCase() + sobrenomeInput.value.slice(1).toLowerCase()
        }

        if(cpfInput.value.length <= 0){
            this.generateError(`O campo de CPF é obrigatório`, cpfInput)
            error = true
        } else if(cpfInput.value.length !== 11) {
            this.generateError(`O CPF precisa ter 11 dígitos`, cpfInput)
            error = true
        } else if(!validacaoCPF.validaCPF()) {
            this.generateError(`CPF inválido`, cpfInput)
            error = true
        }

        if(!validator.isEmail(emailInput.value)){
            this.generateError(`E-mail inválido!`, emailInput)
            error = true
        }

        if(passwordInput.value.length < 3 || passwordInput.value.length > 20){
            this.generateError(`O campo de senha deve conter entre 3 e 20 caracteres!`, passwordInput)
            error = true
        }

        if(passwordInput.value !== confirmPasswordInput.value){
            this.generateError(`As senhas devem ser iguais`, confirmPasswordInput)
            error = true
        }

        if(!error) el.submit()
    }
}