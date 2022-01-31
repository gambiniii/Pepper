export default class Chamado{
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
        let assuntoInput = el.querySelector('input[name="assunto"]')
        let categoriaInput = el.querySelector('select[name="categoria"]')
        let descricaoInput = el.querySelector('textarea[name="descricao"]')


        if(!assuntoInput.value.length > 0){
            this.generateError(`Informe o assunto do chamado`, assuntoInput)
            error = true
        } else if(assuntoInput.value.length < 3 || assuntoInput.value.length > 30){
            this.generateError(`O assunto do chamado deve conter entre 3 e 30 caracteres`, assuntoInput)
            error = true
        }

        if(!categoriaInput.selectedIndex){
            this.generateError('Selecione uma opção!',categoriaInput)
            error = true
        }

        
        if(!descricaoInput.value.length > 0){
            this.generateError(`Insira uma descrição para o chamado!`, descricaoInput)
            error = true
        } else if(descricaoInput.value.length < 10 || descricaoInput.value.length > 1000){
            this.generateError(`A descrição deve conter entre 10 e 1000 caracteres`, descricaoInput)
            error = true
        }

        if(!error) el.submit()
    }
}