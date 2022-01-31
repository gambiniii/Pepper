import validator from "validator";

export default class Login{
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
        let emailInput = el.querySelector('input[name="email"]')
        let passwordInput = el.querySelector('input[name="password"]')

        if(!emailInput.value.length > 0){
            this.generateError(`O campo de e-mail deve ser preenchido!`, emailInput)
            error = true
        } else if(!validator.isEmail(emailInput.value)){
            this.generateError(`E-mail inválido!`, emailInput)
            error = true
        }

        if(!passwordInput.value.length > 0){
            this.generateError(`O campo de senha deve ser preenchido!`, passwordInput)
            error = true
        } else if(passwordInput.value.length < 3 || passwordInput.value.length > 20){
            this.generateError(`A senha deve ter entre 3 e 20 caracteres!`, passwordInput)
            error = true
        }

        if(!error) el.submit()
    }
}